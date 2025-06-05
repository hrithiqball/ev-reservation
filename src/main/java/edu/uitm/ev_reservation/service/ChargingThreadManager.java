package edu.uitm.ev_reservation.service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import edu.uitm.ev_reservation.dto.ChargingProgressMessage;
import edu.uitm.ev_reservation.entity.ChargingSession;
import edu.uitm.ev_reservation.repository.ChargingSessionRepository;
import edu.uitm.ev_reservation.websocket.ChargingWebSocketHandler;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class ChargingThreadManager {

  private static final Logger logger = LoggerFactory.getLogger(ChargingThreadManager.class);

  private final Map<String, Future<?>> sessionThreads = new ConcurrentHashMap<>();
  private final ExecutorService executorService = Executors.newCachedThreadPool();
  private final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);

  private final ChargingWebSocketHandler chargingWebSocketHandler;
  private final ChargingSessionRepository chargingSessionRepository;

  public ChargingThreadManager(ChargingWebSocketHandler chargingWebSocketHandler,
      ChargingSessionRepository chargingSessionRepository) {
    this.chargingWebSocketHandler = chargingWebSocketHandler;
    this.chargingSessionRepository = chargingSessionRepository;
  }

  @PostConstruct
  public void startChargingMonitor() {
    logger.info("Starting charging session monitor - checks every 30 seconds");
    scheduledExecutorService.scheduleAtFixedRate(this::checkChargingSessions, 0, 30, TimeUnit.SECONDS);
  }

  @PreDestroy
  public void shutdown() {
    logger.info("Shutting down charging thread manager");
    scheduledExecutorService.shutdown();
    executorService.shutdown();
    try {
      if (!scheduledExecutorService.awaitTermination(5, TimeUnit.SECONDS)) {
        scheduledExecutorService.shutdownNow();
      }
      if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
        executorService.shutdownNow();
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      scheduledExecutorService.shutdownNow();
      executorService.shutdownNow();
    }
  }

  private void checkChargingSessions() {
    logger.info("Checking charging sessions...");

    try {
      List<ChargingSession> allSessions = chargingSessionRepository.findAll();
      Date currentTime = new Date();

      for (ChargingSession session : allSessions) {
        if (session.isCompleted) {
          logger.info("Session {} is already completed, skipping", session.id);
          continue;
        }
        String sessionKey = "session_" + session.id;

        boolean shouldStartCharging = false;

        if (!session.isReserved) {
          logger.info("Session {} is started (not reserved)", session.id);
          shouldStartCharging = true;
        } else if (session.startTime != null &&
            currentTime.getTime() >= session.startTime.getTime()) {
          logger.info("Session {} start time reached: {}", session.id, session.startTime);
          shouldStartCharging = true;
        } else {
          logger.info("Session {} is not ready to start (reserved or start time not reached)", session.id);
          logger.info("Current time: {}, Session start time: {}", currentTime, session.startTime);
        }

        if (shouldStartCharging && !sessionThreads.containsKey(sessionKey) && !session.isCompleted) {
          logger.info("Starting charging thread for session {}", session.id);
          Future<?> chargingTask = executorService.submit(() -> runChargingSession(session));
          sessionThreads.put(sessionKey, chargingTask);
        }
      }
    } catch (Exception e) {
      logger.error("Error checking charging sessions", e);
    }
  }

  private void runChargingSession(ChargingSession session) {
    String sessionKey = "session_" + session.id;
    logger.info("Charging session {} started", session.id);

    try {
      ChargingProgressMessage startMessage = ChargingProgressMessage.builder()
          .sessionId(session.id)
          .station(session.station)
          .pump(session.pumpNumber)
          .vehicle(session.vehicle)
          .chargingRate(0)
          .status("started")
          .build();
      chargingWebSocketHandler.broadcastChargingProgress(startMessage);

      for (int i = 1; i <= 10; i++) {
        logger.info("Session {} charging: {}", session.id, i);
        System.out.println("Session " + session.id + " charging: " + i);

        try {
          ChargingProgressMessage progressMessage = ChargingProgressMessage.builder()
              .sessionId(session.id)
              .station(session.station)
              .pump(session.pumpNumber)
              .vehicle(session.vehicle)
              .chargingRate(i)
              .status("charging")
              .build();
          chargingWebSocketHandler.broadcastChargingProgress(progressMessage);
        } catch (Exception e) {
          logger.error("Error broadcasting charging progress", e);
        }

        Thread.sleep(1000);
      }

      try {
        ChargingSession updatedSession = chargingSessionRepository.findById(session.id).orElse(null);
        if (updatedSession != null) {
          updatedSession.isCompleted = true;
          chargingSessionRepository.save(updatedSession);

          ChargingProgressMessage completionMessage = ChargingProgressMessage.builder()
              .sessionId(updatedSession.id)
              .station(updatedSession.station)
              .pump(updatedSession.pumpNumber)
              .vehicle(updatedSession.vehicle)
              .chargingRate(10)
              .status("completed")
              .build();
          chargingWebSocketHandler.broadcastChargingProgress(completionMessage);
        }
      } catch (Exception e) {
        logger.error("Error completing charging session", e);
      }

      logger.info("Charging session {} completed", session.id);

    } catch (InterruptedException e) {
      logger.info("Charging session {} was interrupted", session.id);
      Thread.currentThread().interrupt();
    } catch (Exception e) {
      logger.error("Error in charging session " + session.id, e);
    } finally {
      sessionThreads.remove(sessionKey);
      logger.info("Charging thread for session {} terminated", session.id);
    }
  }

  public void stopChargingSession(Long sessionId) {
    String sessionKey = "session_" + sessionId;
    Future<?> task = sessionThreads.get(sessionKey);
    if (task != null) {
      logger.info("Manually stopping charging session {}", sessionId);
      task.cancel(true);
      sessionThreads.remove(sessionKey);
    }
  }

  public boolean isSessionCharging(Long sessionId) {
    String sessionKey = "session_" + sessionId;
    Future<?> task = sessionThreads.get(sessionKey);
    return task != null && !task.isDone();
  }
}

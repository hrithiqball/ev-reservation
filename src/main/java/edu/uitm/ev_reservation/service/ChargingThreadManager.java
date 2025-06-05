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
        if (session.isCompleted()) {
          logger.info("Session {} is already completed, skipping", session.getId());
          continue;
        }

        if (session.isCharging()) {
          logger.info("Session {} is already charging, skipping", session.getId());
          continue;
        }

        String sessionKey = "session_" + session.getId();

        boolean shouldStartCharging = false;

        if (!session.isReserved()) {
          logger.info("Session {} is started (not reserved)", session.getId());
          shouldStartCharging = true;
        } else if (session.getStartTime() != null &&
            currentTime.getTime() >= session.getStartTime().getTime()) {
          logger.info("Session {} start time reached: {}", session.getId(), session.getStartTime());
          shouldStartCharging = true;
        } else {
          logger.info("Session {} is not ready to start (reserved or start time not reached)", session.getId());
          logger.info("Current time: {}, Session start time: {}", currentTime, session.getStartTime());
        }

        if (shouldStartCharging && !sessionThreads.containsKey(sessionKey) && !session.isCompleted()
            && !session.isCharging()) {
          logger.info("Starting charging thread for session {}", session.getId());

          session.setCharging(true);
          chargingSessionRepository.save(session);

          Future<?> chargingTask = executorService.submit(() -> runChargingSession(session));
          sessionThreads.put(sessionKey, chargingTask);
        }
      }
    } catch (Exception e) {
      logger.error("Error checking charging sessions", e);
    }
  }

  private void runChargingSession(ChargingSession session) {
    String sessionKey = "session_" + session.getId();
    logger.info("Charging session {} started", session.getId());

    try {
      int batteryCapacity = session.getVehicle().getBatteryCapacity();
      int chargingDurationSeconds = (int) Math.ceil(batteryCapacity / 1000.0);

      logger.info("Session {} - Battery capacity: {}, Charging duration: {} seconds",
          session.getId(), batteryCapacity, chargingDurationSeconds);

      ChargingProgressMessage startMessage = ChargingProgressMessage.builder()
          .sessionId(session.getId())
          .station(session.getStation())
          .pump(session.getPumpNumber())
          .vehicle(session.getVehicle())
          .chargingRate(0)
          .status("started")
          .build();
      chargingWebSocketHandler.broadcastChargingProgress(startMessage);

      for (int i = 1; i <= chargingDurationSeconds; i++) {
        int currentCharge = i * 100; // 100 units per second
        logger.info("Session {} charging: {} units ({}/{}s)", session.getId(), currentCharge, i,
            chargingDurationSeconds);
        System.out.println("Session " + session.getId() + " charging: " + currentCharge + " units (" + i + "/"
            + chargingDurationSeconds + "s)");

        try {
          ChargingProgressMessage progressMessage = ChargingProgressMessage.builder()
              .sessionId(session.getId())
              .station(session.getStation())
              .pump(session.getPumpNumber())
              .vehicle(session.getVehicle())
              .chargingRate(currentCharge)
              .status("charging")
              .build();
          chargingWebSocketHandler.broadcastChargingProgress(progressMessage);
        } catch (Exception e) {
          logger.error("Error broadcasting charging progress", e);
        }

        try {
          Thread.sleep(1000);
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          throw e;
        }
      }

      try {
        ChargingSession updatedSession = chargingSessionRepository.findById(session.getId()).orElse(null);
        if (updatedSession != null) {
          updatedSession.setCompleted(true);
          updatedSession.setCharging(false);
          chargingSessionRepository.save(updatedSession);

          int finalCharge = chargingDurationSeconds * 100;
          ChargingProgressMessage completionMessage = ChargingProgressMessage.builder()
              .sessionId(updatedSession.getId())
              .station(updatedSession.getStation())
              .pump(updatedSession.getPumpNumber())
              .vehicle(updatedSession.getVehicle())
              .chargingRate(finalCharge)
              .status("completed")
              .build();
          chargingWebSocketHandler.broadcastChargingProgress(completionMessage);
        }
      } catch (Exception e) {
        logger.error("Error completing charging session", e);
      }

      logger.info("Charging session {} completed", session.getId());

    } catch (InterruptedException e) {
      logger.info("Charging session {} was interrupted", session.getId());
      Thread.currentThread().interrupt();

      try {
        ChargingSession updatedSession = chargingSessionRepository.findById(session.getId()).orElse(null);
        if (updatedSession != null) {
          updatedSession.setCharging(false);
          chargingSessionRepository.save(updatedSession);
        }
      } catch (Exception ex) {
        logger.error("Error resetting charging status for interrupted session", ex);
      }
    } catch (Exception e) {
      logger.error("Error in charging session " + session.getId(), e);

      try {
        ChargingSession updatedSession = chargingSessionRepository.findById(session.getId()).orElse(null);
        if (updatedSession != null) {
          updatedSession.setCharging(false);
          chargingSessionRepository.save(updatedSession);
        }
      } catch (Exception ex) {
        logger.error("Error resetting charging status for failed session", ex);
      }
    } finally {
      sessionThreads.remove(sessionKey);
      logger.info("Charging thread for session {} terminated", session.getId());
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

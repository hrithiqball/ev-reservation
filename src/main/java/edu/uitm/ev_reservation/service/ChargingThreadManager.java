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
        String sessionKey = "session_" + session.getId();

        // Check if session should start charging
        boolean shouldStartCharging = false;

        if (!session.isReserved()) {
          // Session is started (not reserved)
          logger.info("Session {} is started (not reserved)", session.getId());
          shouldStartCharging = true;
        } else if (session.getStartTime() != null &&
            currentTime.getTime() >= session.getStartTime().getTime()) {
          // Current time matches or exceeds start time
          logger.info("Session {} start time reached: {}", session.getId(), session.getStartTime());
          shouldStartCharging = true;
        }

        if (shouldStartCharging && !sessionThreads.containsKey(sessionKey) && !session.isCompleted()) {
          // Start new charging thread
          logger.info("Starting charging thread for session {}", session.getId());
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
      // Run for 10 seconds, logging each second
      for (int i = 1; i <= 10; i++) {
        logger.info("Session {} charging: {}", session.getId(), i);
        System.out.println("Session " + session.getId() + " charging: " + i);

        // Broadcast charging progress via websocket only (no database updates during
        // charging)
        try {
          // Create a simple message for websocket broadcasting
          String progressMessage = "Session " + session.getId() + " charging: " + i + "/10";
          chargingWebSocketHandler.broadcast(session); // Broadcast the original session
        } catch (Exception e) {
          logger.error("Error broadcasting charging progress", e);
        }

        Thread.sleep(1000); // Wait 1 second
      }

      // Mark session as completed in database only at the end
      try {
        ChargingSession updatedSession = chargingSessionRepository.findById(session.getId()).orElse(null);
        if (updatedSession != null) {
          updatedSession.setCompleted(true);
          chargingSessionRepository.save(updatedSession);
          chargingWebSocketHandler.broadcast(updatedSession); // Broadcast completion
        }
      } catch (Exception e) {
        logger.error("Error completing charging session", e);
      }

      logger.info("Charging session {} completed", session.getId());

    } catch (InterruptedException e) {
      logger.info("Charging session {} was interrupted", session.getId());
      Thread.currentThread().interrupt();
    } catch (Exception e) {
      logger.error("Error in charging session " + session.getId(), e);
    } finally {
      // Remove from active threads
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

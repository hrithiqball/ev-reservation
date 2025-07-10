package edu.uitm.ev_reservation.service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

  private final Map<String, Thread> sessionThreads = new ConcurrentHashMap<>();
  private Thread monitorThread;
  private volatile boolean running = true;

  private final ChargingWebSocketHandler chargingWebSocketHandler;
  private final ChargingSessionRepository chargingSessionRepository;

  public ChargingThreadManager(ChargingWebSocketHandler chargingWebSocketHandler,
      ChargingSessionRepository chargingSessionRepository) {
    this.chargingWebSocketHandler = chargingWebSocketHandler;
    this.chargingSessionRepository = chargingSessionRepository;
  }

  @PostConstruct
  public void startChargingMonitor() {
    logger.info("Starting reserved charging session monitor - checks every 30 seconds");

    // Create a monitor thread that extends Thread class
    monitorThread = new Thread(new Runnable() {
      @Override
      public void run() {
        while (running) {
          try {
            checkChargingSessions();
            Thread.sleep(30000); // Sleep for 30 seconds
          } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.info("Monitor thread interrupted");
            break;
          } catch (Exception e) {
            logger.error("Error in monitor thread", e);
          }
        }
      }
    });

    monitorThread.setName("ChargingSessionMonitor");
    monitorThread.start();
  }

  @PreDestroy
  public void shutdown() {
    logger.info("Shutting down charging thread manager");
    running = false;

    // Interrupt monitor thread
    if (monitorThread != null && monitorThread.isAlive()) {
      monitorThread.interrupt();
      try {
        monitorThread.join(5000); // Wait up to 5 seconds for thread to finish
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        logger.warn("Interrupted while waiting for monitor thread to finish");
      }
    }

    // Stop all charging session threads
    Thread[] threads = sessionThreads.values().toArray(new Thread[0]);
    for (int i = 0; i < threads.length; i++) {
      Thread thread = threads[i];
      if (thread != null && thread.isAlive()) {
        thread.interrupt();
        try {
          thread.join(2000); // Wait up to 2 seconds for each thread to finish
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          logger.warn("Interrupted while waiting for charging thread to finish");
        }
      }
    }
    sessionThreads.clear();
  }

  private void checkChargingSessions() {
    logger.info("Checking reserved charging sessions...111");

    try {
      List<ChargingSession> allSessions = chargingSessionRepository.findAll();
      Date currentTime = new Date();

      for (int i = 0; i < allSessions.size(); i++) {
        ChargingSession session = allSessions.get(i);
        if (session.isCompleted()) {
          logger.info("Session {} is completed, no action needed", session.getId());
          continue;
        }

        if (session.isCharging()) {
          logger.info("Session {} is already charging, skipping", session.getId());
          continue;
        }

        if (!session.isReserved()) {
          logger.debug("Session {} is not reserved, should have been started immediately", session.getId());
          continue;
        }

        String sessionKey = "session_" + session.getId();

        if (session.getStartTime() != null &&
            currentTime.getTime() >= session.getStartTime().getTime()) {
          logger.info("Reserved session {} start time reached: {}", session.getId(), session.getStartTime());

          if (!sessionThreads.containsKey(sessionKey) && !session.isCompleted() && !session.isCharging()) {
            logger.info("Starting charging thread for reserved session {}", session.getId());

            session.setCharging(true);
            chargingSessionRepository.save(session);

            // Create and start a new Thread for charging session
            Thread chargingThread = new Thread(new ChargingSessionRunnable(session));
            chargingThread.setName("ChargingSession-" + session.getId());
            sessionThreads.put(sessionKey, chargingThread);
            chargingThread.start();
          }
        } else {
          logger.debug("Reserved session {} start time not reached yet. Current time: {}, Start time: {}",
              session.getId(), currentTime, session.getStartTime());
        }
      }
    } catch (Exception e) {
      logger.error("Error checking charging sessions", e);
    }
  }

  // Inner class that implements Runnable for charging session threads
  private class ChargingSessionRunnable implements Runnable {
    private final ChargingSession session;

    public ChargingSessionRunnable(ChargingSession session) {
      this.session = session;
    }

    @Override
    public void run() {
      runChargingSession(session);
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
        int currentCharge = i * 100;
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
    Thread thread = sessionThreads.get(sessionKey);
    if (thread != null && thread.isAlive()) {
      logger.info("Manually stopping charging session {}", sessionId);
      thread.interrupt();
      sessionThreads.remove(sessionKey);
    }
  }

  public boolean isSessionCharging(Long sessionId) {
    String sessionKey = "session_" + sessionId;
    Thread thread = sessionThreads.get(sessionKey);
    return thread != null && thread.isAlive();
  }

  public void startChargingSessionImmediately(ChargingSession session) {
    if (session.isCompleted()) {
      logger.info("Session {} is already completed, cannot start", session.getId());
      return;
    }

    if (session.isCharging()) {
      logger.info("Session {} is already charging, cannot start", session.getId());
      return;
    }

    if (session.isReserved()) {
      logger.info("Session {} is reserved, cannot start immediately", session.getId());
      return;
    }

    String sessionKey = "session_" + session.getId();

    if (sessionThreads.containsKey(sessionKey)) {
      logger.info("Session {} already has a running thread, cannot start", session.getId());
      return;
    }

    logger.info("Starting charging thread immediately for non-reserved session {}", session.getId());

    session.setCharging(true);
    chargingSessionRepository.save(session);

    // Create and start a new Thread for immediate charging session
    Thread chargingThread = new Thread(new ChargingSessionRunnable(session));
    chargingThread.setName("ChargingSession-" + session.getId());
    sessionThreads.put(sessionKey, chargingThread);
    chargingThread.start();
  }
}

package edu.uitm.ev_reservation.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.springframework.stereotype.Service;

import edu.uitm.ev_reservation.dto.ChargingSessionRequest;
import edu.uitm.ev_reservation.websocket.ChargingWebSocketHandler;

@Service
public class ChargingThreadManager {

  private final Map<String, Future<?>> sessionThreads = new ConcurrentHashMap<>();
  private final ExecutorService executorService = Executors.newCachedThreadPool();

  private final ChargingWebSocketHandler chargingWebSocketHandler;

  public ChargingThreadManager(ChargingWebSocketHandler chargingWebSocketHandler) {
    this.chargingWebSocketHandler = chargingWebSocketHandler;
  }

  public void startChargingSession(String sessionId, ChargingSessionRequest request) {
    Future<?> future = executorService.submit(() -> {
      try {
          long delay = Duration.between(LocalDateTime.now(), request.getStartTime())
      } catch (Exception e) {
      }
    })
  }
}

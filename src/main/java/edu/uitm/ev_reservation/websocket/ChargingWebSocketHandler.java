package edu.uitm.ev_reservation.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.uitm.ev_reservation.entity.ChargingSession;

@Component
public class ChargingWebSocketHandler extends TextWebSocketHandler {

  private static final Logger logger = LoggerFactory.getLogger(ChargingWebSocketHandler.class);

  private static final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) {
    sessions.add(session);
  }

  @Override
  public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
    sessions.remove(session);
  }

  public void broadcast(ChargingSession session) {
    ObjectMapper mapper = new ObjectMapper();
    try {
      String json = mapper.writeValueAsString(session);
      for (WebSocketSession ws : sessions) {
        if (ws.isOpen()) {
          ws.sendMessage(new TextMessage(json));
        }
      }
    } catch (IOException e) {
      logger.error("Failed to broadcast charging session", e);
    }
  }
}

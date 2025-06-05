package edu.uitm.ev_reservation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import edu.uitm.ev_reservation.websocket.ChargingWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  private final ChargingWebSocketHandler chargingWebSocketHandler;

  public WebSocketConfig(ChargingWebSocketHandler chargingWebSocketHandler) {
    this.chargingWebSocketHandler = chargingWebSocketHandler;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(chargingWebSocketHandler, "/ws/charging").setAllowedOrigins("*");
  }
}

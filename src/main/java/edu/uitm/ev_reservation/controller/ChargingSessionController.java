package edu.uitm.ev_reservation.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uitm.ev_reservation.dto.ChargingSessionRequest;
import edu.uitm.ev_reservation.entity.ChargingSession;
import edu.uitm.ev_reservation.entity.EVStation;
import edu.uitm.ev_reservation.entity.User;
import edu.uitm.ev_reservation.entity.Vehicle;
import edu.uitm.ev_reservation.repository.ChargingSessionRepository;
import edu.uitm.ev_reservation.repository.EVStationRepository;
import edu.uitm.ev_reservation.repository.UserRepository;
import edu.uitm.ev_reservation.repository.VehicleRepository;
import edu.uitm.ev_reservation.service.ChargingThreadManager;

@RestController
@RequestMapping("/api/charging-sessions")
public class ChargingSessionController {
  private static final Logger logger = LoggerFactory.getLogger(ChargingSessionController.class);
  private final ChargingSessionRepository chargingSessionRepository;
  private final UserRepository userRepository;
  private final VehicleRepository vehicleRepository;
  private final EVStationRepository evStationRepository;
  private final ChargingThreadManager chargingThreadManager;

  public ChargingSessionController(ChargingSessionRepository chargingSessionRepository,
      UserRepository userRepository,
      VehicleRepository vehicleRepository,
      EVStationRepository evStationRepository,
      ChargingThreadManager chargingThreadManager) {
    this.chargingSessionRepository = chargingSessionRepository;
    this.userRepository = userRepository;
    this.vehicleRepository = vehicleRepository;
    this.evStationRepository = evStationRepository;
    this.chargingThreadManager = chargingThreadManager;
  }

  @PostMapping
  public ResponseEntity<Void> createChargingSession(@RequestBody ChargingSessionRequest request) {
    User user = userRepository.findById(request.userId).orElse(null);
    Vehicle vehicle = vehicleRepository.findById(request.vehicleId).orElse(null);
    EVStation station = evStationRepository.findById(request.stationId).orElse(null);

    ChargingSession session = ChargingSession.builder()
        .user(user)
        .vehicle(vehicle)
        .station(station)
        .pumpNumber(request.pumpNumber)
        .isReserved(request.isReserved)
        .startTime(request.startTime)
        .isCompleted(false)
        .build();

    chargingSessionRepository.save(session);
    logger.info("Created ChargingSession: {}", session);
    System.out.println("Created ChargingSession: " + session);

    if (!request.isReserved) {
      logger.info("Session {} is not reserved, starting charging immediately", session.getId());
      chargingThreadManager.startChargingSessionImmediately(session);
    } else {
      logger.info("Session {} is reserved for {}, will be checked by scheduler", session.getId(),
          session.getStartTime());
    }

    return ResponseEntity.ok().build();
  }
}

package edu.uitm.ev_reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.uitm.ev_reservation.entity.ChargingSession;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {

}

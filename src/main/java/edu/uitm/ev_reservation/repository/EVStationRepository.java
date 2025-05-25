package edu.uitm.ev_reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.uitm.ev_reservation.entity.EVStation;

public interface EVStationRepository extends JpaRepository<EVStation, Long> {

}

package edu.uitm.ev_reservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.uitm.ev_reservation.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
  List<Vehicle> findByOwnerId(Long ownerId);

}

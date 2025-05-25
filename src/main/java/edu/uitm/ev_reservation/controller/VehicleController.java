package edu.uitm.ev_reservation.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uitm.ev_reservation.entity.User;
import edu.uitm.ev_reservation.entity.Vehicle;
import edu.uitm.ev_reservation.repository.UserRepository;
import edu.uitm.ev_reservation.repository.VehicleRepository;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
  @Autowired
  private VehicleRepository vehicleRepository;
  @Autowired
  private UserRepository userRepository;

  @GetMapping
  public List<Vehicle> getAllVehicles() {
    return vehicleRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
    Optional<Vehicle> vehicle = vehicleRepository.findById(id);
    return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
    if (vehicle.getOwner() != null && vehicle.getOwner().getId() != null) {
      Optional<User> owner = userRepository.findById(vehicle.getOwner().getId());
      owner.ifPresent(vehicle::setOwner);
    }
    Vehicle savedVehicle = vehicleRepository.save(vehicle);
    return ResponseEntity.ok(savedVehicle);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
    Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
    if (!optionalVehicle.isPresent()) {
      return ResponseEntity.notFound().build();
    }
    Vehicle vehicle = optionalVehicle.get();
    vehicle.setMake(vehicleDetails.getMake());
    vehicle.setModel(vehicleDetails.getModel());
    vehicle.setPlateNumber(vehicleDetails.getPlateNumber());
    vehicle.setBatteryCapacity(vehicleDetails.getBatteryCapacity());
    if (vehicleDetails.getOwner() != null && vehicleDetails.getOwner().getId() != null) {
      Optional<User> owner = userRepository.findById(vehicleDetails.getOwner().getId());
      owner.ifPresent(vehicle::setOwner);
    }
    Vehicle updatedVehicle = vehicleRepository.save(vehicle);
    return ResponseEntity.ok(updatedVehicle);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
    if (!vehicleRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    vehicleRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}

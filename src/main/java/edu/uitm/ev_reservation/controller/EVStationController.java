package edu.uitm.ev_reservation.controller;

import java.util.List;

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

import edu.uitm.ev_reservation.entity.EVStation;
import edu.uitm.ev_reservation.repository.EVStationRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class EVStationController {

  @Autowired
  private EVStationRepository stationRepository;

  @PostMapping
  public ResponseEntity<EVStation> createStation(@RequestBody EVStation station) {
    return ResponseEntity.ok(stationRepository.save(station));
  }

  @GetMapping
  public ResponseEntity<List<EVStation>> getAllStations() {
    return ResponseEntity.ok(stationRepository.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<EVStation> getStation(@PathVariable Long id) {
    return stationRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<EVStation> updateStation(@PathVariable Long id, @RequestBody EVStation updated) {
    return stationRepository.findById(id)
        .map(station -> {
          station.setName(updated.getName());
          station.setLocation(updated.getLocation());
          station.setNumberOfPumps(updated.getNumberOfPumps());
          return ResponseEntity.ok(stationRepository.save(station));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
    if (stationRepository.existsById(id)) {
      stationRepository.deleteById(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
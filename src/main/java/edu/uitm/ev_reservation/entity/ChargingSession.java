package edu.uitm.ev_reservation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "charging_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChargingSession {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private User user;

  @ManyToOne
  private Vehicle vehicle;

  @ManyToOne
  private EVStation station;

  private int pumpNumber;

  private int currentCharge;

  private boolean isCompleted;
}

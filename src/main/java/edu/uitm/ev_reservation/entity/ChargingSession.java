package edu.uitm.ev_reservation.entity;

import java.util.Date;

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
  public Long id;

  @ManyToOne
  public User user;

  @ManyToOne
  public Vehicle vehicle;

  @ManyToOne
  public EVStation station;

  public int pumpNumber;

  public boolean isCompleted;

  public boolean isReserved;

  public Date startTime;
}

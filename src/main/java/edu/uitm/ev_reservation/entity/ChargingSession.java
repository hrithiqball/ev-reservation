package edu.uitm.ev_reservation.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "charging_sessions")
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

  private boolean isCompleted;

  private boolean isReserved;

  private boolean isCharging;

  private Date startTime;

  public ChargingSession() {
  }

  public ChargingSession(Long id, User user, Vehicle vehicle, EVStation station,
      int pumpNumber, boolean isCompleted, boolean isReserved,
      boolean isCharging, Date startTime) {
    this.id = id;
    this.user = user;
    this.vehicle = vehicle;
    this.station = station;
    this.pumpNumber = pumpNumber;
    this.isCompleted = isCompleted;
    this.isReserved = isReserved;
    this.isCharging = isCharging;
    this.startTime = startTime;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public EVStation getStation() {
    return station;
  }

  public void setStation(EVStation station) {
    this.station = station;
  }

  public int getPumpNumber() {
    return pumpNumber;
  }

  public void setPumpNumber(int pumpNumber) {
    this.pumpNumber = pumpNumber;
  }

  public boolean isCompleted() {
    return isCompleted;
  }

  public void setCompleted(boolean completed) {
    isCompleted = completed;
  }

  public boolean isReserved() {
    return isReserved;
  }

  public void setReserved(boolean reserved) {
    isReserved = reserved;
  }

  public boolean isCharging() {
    return isCharging;
  }

  public void setCharging(boolean charging) {
    isCharging = charging;
  }

  public Date getStartTime() {
    return startTime;
  }

  public void setStartTime(Date startTime) {
    this.startTime = startTime;
  }

  public static ChargingSessionBuilder builder() {
    return new ChargingSessionBuilder();
  }

  public static class ChargingSessionBuilder {
    private Long id;
    private User user;
    private Vehicle vehicle;
    private EVStation station;
    private int pumpNumber;
    private boolean isCompleted;
    private boolean isReserved;
    private boolean isCharging;
    private Date startTime;

    public ChargingSessionBuilder id(Long id) {
      this.id = id;
      return this;
    }

    public ChargingSessionBuilder user(User user) {
      this.user = user;
      return this;
    }

    public ChargingSessionBuilder vehicle(Vehicle vehicle) {
      this.vehicle = vehicle;
      return this;
    }

    public ChargingSessionBuilder station(EVStation station) {
      this.station = station;
      return this;
    }

    public ChargingSessionBuilder pumpNumber(int pumpNumber) {
      this.pumpNumber = pumpNumber;
      return this;
    }

    public ChargingSessionBuilder isCompleted(boolean isCompleted) {
      this.isCompleted = isCompleted;
      return this;
    }

    public ChargingSessionBuilder isReserved(boolean isReserved) {
      this.isReserved = isReserved;
      return this;
    }

    public ChargingSessionBuilder isCharging(boolean isCharging) {
      this.isCharging = isCharging;
      return this;
    }

    public ChargingSessionBuilder startTime(Date startTime) {
      this.startTime = startTime;
      return this;
    }

    public ChargingSession build() {
      return new ChargingSession(id, user, vehicle, station, pumpNumber,
          isCompleted, isReserved, isCharging, startTime);
    }
  }
}

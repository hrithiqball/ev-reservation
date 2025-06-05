package edu.uitm.ev_reservation.dto;

import edu.uitm.ev_reservation.entity.EVStation;
import edu.uitm.ev_reservation.entity.Vehicle;

public class ChargingProgressMessage {
  private EVStation station;
  private Integer pump;
  private Vehicle vehicle;
  private Integer chargingRate;
  private Long sessionId;
  private String status;

  public ChargingProgressMessage() {
  }

  public ChargingProgressMessage(EVStation station, Integer pump, Vehicle vehicle, Integer chargingRate, Long sessionId,
      String status) {
    this.station = station;
    this.pump = pump;
    this.vehicle = vehicle;
    this.chargingRate = chargingRate;
    this.sessionId = sessionId;
    this.status = status;
  }

  public static ChargingProgressMessageBuilder builder() {
    return new ChargingProgressMessageBuilder();
  }

  public EVStation getStation() {
    return station;
  }

  public void setStation(EVStation station) {
    this.station = station;
  }

  public Integer getPump() {
    return pump;
  }

  public void setPump(Integer pump) {
    this.pump = pump;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public Integer getChargingRate() {
    return chargingRate;
  }

  public void setChargingRate(Integer chargingRate) {
    this.chargingRate = chargingRate;
  }

  public Long getSessionId() {
    return sessionId;
  }

  public void setSessionId(Long sessionId) {
    this.sessionId = sessionId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public static class ChargingProgressMessageBuilder {
    private EVStation station;
    private Integer pump;
    private Vehicle vehicle;
    private Integer chargingRate;
    private Long sessionId;
    private String status;

    public ChargingProgressMessageBuilder station(EVStation station) {
      this.station = station;
      return this;
    }

    public ChargingProgressMessageBuilder pump(Integer pump) {
      this.pump = pump;
      return this;
    }

    public ChargingProgressMessageBuilder vehicle(Vehicle vehicle) {
      this.vehicle = vehicle;
      return this;
    }

    public ChargingProgressMessageBuilder chargingRate(Integer chargingRate) {
      this.chargingRate = chargingRate;
      return this;
    }

    public ChargingProgressMessageBuilder sessionId(Long sessionId) {
      this.sessionId = sessionId;
      return this;
    }

    public ChargingProgressMessageBuilder status(String status) {
      this.status = status;
      return this;
    }

    public ChargingProgressMessage build() {
      return new ChargingProgressMessage(station, pump, vehicle, chargingRate, sessionId, status);
    }
  }
}

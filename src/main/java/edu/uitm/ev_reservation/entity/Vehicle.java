package edu.uitm.ev_reservation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class Vehicle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String make;

  private String model;

  private String plateNumber;

  private int batteryCapacity;

  @ManyToOne
  private User owner;

  public Vehicle() {
  }

  public Vehicle(Long id, String make, String model, String plateNumber, int batteryCapacity, User owner) {
    this.id = id;
    this.make = make;
    this.model = model;
    this.plateNumber = plateNumber;
    this.batteryCapacity = batteryCapacity;
    this.owner = owner;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getMake() {
    return make;
  }

  public void setMake(String make) {
    this.make = make;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber;
  }

  public int getBatteryCapacity() {
    return batteryCapacity;
  }

  public void setBatteryCapacity(int batteryCapacity) {
    this.batteryCapacity = batteryCapacity;
  }

  public User getOwner() {
    return owner;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }

  public static VehicleBuilder builder() {
    return new VehicleBuilder();
  }

  public static class VehicleBuilder {
    private Long id;
    private String make;
    private String model;
    private String plateNumber;
    private int batteryCapacity;
    private User owner;

    public VehicleBuilder id(Long id) {
      this.id = id;
      return this;
    }

    public VehicleBuilder make(String make) {
      this.make = make;
      return this;
    }

    public VehicleBuilder model(String model) {
      this.model = model;
      return this;
    }

    public VehicleBuilder plateNumber(String plateNumber) {
      this.plateNumber = plateNumber;
      return this;
    }

    public VehicleBuilder batteryCapacity(int batteryCapacity) {
      this.batteryCapacity = batteryCapacity;
      return this;
    }

    public VehicleBuilder owner(User owner) {
      this.owner = owner;
      return this;
    }

    public Vehicle build() {
      return new Vehicle(id, make, model, plateNumber, batteryCapacity, owner);
    }
  }
}

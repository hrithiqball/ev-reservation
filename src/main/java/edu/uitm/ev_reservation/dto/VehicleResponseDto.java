package edu.uitm.ev_reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponseDto {
  private Long id;
  private String make;
  private String model;
  private String plateNumber;
  private Integer batteryCapacity;
  private UserResponseDto owner;
}

package edu.uitm.ev_reservation.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChargingSessionResponseDto {
  private Long id;
  private UserResponseDto user;
  private VehicleResponseDto vehicle;
  private EVStationResponseDto station;
  private Integer pumpNumber;
  private Boolean isCompleted;
  private Boolean isReserved;
  private Boolean isCharging;
  private Date startTime;
}

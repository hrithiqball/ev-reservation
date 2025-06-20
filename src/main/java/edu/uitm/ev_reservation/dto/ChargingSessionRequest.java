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
public class ChargingSessionRequest {
  public Long userId;
  public Long vehicleId;
  public Long stationId;
  public int pumpNumber;
  public boolean isReserved;
  public Date startTime;
}

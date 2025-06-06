package edu.uitm.ev_reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EVStationResponseDto {
  private Long id;
  private String name;
  private String location;
  private Integer numberOfPumps;
}

package edu.uitm.ev_reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
  private Long id;
  private String email;
  private String name;
  private Boolean isAdmin;
}

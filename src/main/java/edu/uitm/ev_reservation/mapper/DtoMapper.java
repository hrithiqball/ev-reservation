package edu.uitm.ev_reservation.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import edu.uitm.ev_reservation.dto.ChargingSessionResponseDto;
import edu.uitm.ev_reservation.dto.EVStationResponseDto;
import edu.uitm.ev_reservation.dto.UserResponseDto;
import edu.uitm.ev_reservation.dto.VehicleResponseDto;
import edu.uitm.ev_reservation.entity.ChargingSession;
import edu.uitm.ev_reservation.entity.EVStation;
import edu.uitm.ev_reservation.entity.User;
import edu.uitm.ev_reservation.entity.Vehicle;

/**
 * Utility class for mapping entities to DTOs
 * Prevents sensitive data (like passwords) from being exposed in API responses
 */
public class DtoMapper {

  /**
   * Convert User entity to UserResponseDto (excludes password)
   */
  public static UserResponseDto toUserResponseDto(User user) {
    if (user == null) {
      return null;
    }
    return UserResponseDto.builder()
        .id(user.getId())
        .email(user.getEmail())
        .name(user.getName())
        .isAdmin(user.getIsAdmin())
        .build();
  }

  /**
   * Convert Vehicle entity to VehicleResponseDto
   */
  public static VehicleResponseDto toVehicleResponseDto(Vehicle vehicle) {
    if (vehicle == null) {
      return null;
    }
    return VehicleResponseDto.builder()
        .id(vehicle.getId())
        .make(vehicle.getMake())
        .model(vehicle.getModel())
        .plateNumber(vehicle.getPlateNumber())
        .batteryCapacity(vehicle.getBatteryCapacity())
        .owner(toUserResponseDto(vehicle.getOwner()))
        .build();
  }

  /**
   * Convert EVStation entity to EVStationResponseDto
   */
  public static EVStationResponseDto toEVStationResponseDto(EVStation station) {
    if (station == null) {
      return null;
    }
    return EVStationResponseDto.builder()
        .id(station.getId())
        .name(station.getName())
        .location(station.getLocation())
        .numberOfPumps(station.getNumberOfPumps())
        .build();
  }

  /**
   * Convert ChargingSession entity to ChargingSessionResponseDto
   */
  public static ChargingSessionResponseDto toChargingSessionResponseDto(ChargingSession session) {
    if (session == null) {
      return null;
    }
    return ChargingSessionResponseDto.builder()
        .id(session.getId())
        .user(toUserResponseDto(session.getUser()))
        .vehicle(toVehicleResponseDto(session.getVehicle()))
        .station(toEVStationResponseDto(session.getStation()))
        .pumpNumber(session.getPumpNumber())
        .isCompleted(session.isCompleted())
        .isReserved(session.isReserved())
        .isCharging(session.isCharging())
        .startTime(session.getStartTime())
        .build();
  }

  /**
   * Convert Page of ChargingSession entities to Page of
   * ChargingSessionResponseDto
   * This solves the Spring Data PageImpl serialization warning by creating a
   * proper DTO response
   */
  public static Page<ChargingSessionResponseDto> toChargingSessionResponseDtoPage(Page<ChargingSession> sessionPage) {
    List<ChargingSessionResponseDto> dtoList = sessionPage.getContent()
        .stream()
        .map(DtoMapper::toChargingSessionResponseDto)
        .collect(Collectors.toList());

    return new PageImpl<>(dtoList, sessionPage.getPageable(), sessionPage.getTotalElements());
  }
}

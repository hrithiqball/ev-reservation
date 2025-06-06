package edu.uitm.ev_reservation.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.uitm.ev_reservation.entity.ChargingSession;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {

  // Find sessions by user ID
  Page<ChargingSession> findByUserId(Long userId, Pageable pageable);

  // Find sessions by completion status
  Page<ChargingSession> findByIsCompleted(Boolean isCompleted, Pageable pageable);

  // Find sessions by charging status
  Page<ChargingSession> findByIsCharging(Boolean isCharging, Pageable pageable);

  // Find sessions by user ID and completion status
  Page<ChargingSession> findByUserIdAndIsCompleted(Long userId, Boolean isCompleted, Pageable pageable);

  // Find sessions by user ID and charging status
  Page<ChargingSession> findByUserIdAndIsCharging(Long userId, Boolean isCharging, Pageable pageable);

  // Find sessions by completion status and charging status
  Page<ChargingSession> findByIsCompletedAndIsCharging(Boolean isCompleted, Boolean isCharging, Pageable pageable);

  // Find sessions by all three filters
  Page<ChargingSession> findByUserIdAndIsCompletedAndIsCharging(Long userId, Boolean isCompleted, Boolean isCharging,
      Pageable pageable);

  // Custom query for flexible filtering
  @Query("SELECT cs FROM ChargingSession cs WHERE " +
      "(:userId IS NULL OR cs.user.id = :userId) AND " +
      "(:isCompleted IS NULL OR cs.isCompleted = :isCompleted) AND " +
      "(:isCharging IS NULL OR cs.isCharging = :isCharging)")
  Page<ChargingSession> findSessionsWithFilters(@Param("userId") Long userId,
      @Param("isCompleted") Boolean isCompleted,
      @Param("isCharging") Boolean isCharging,
      Pageable pageable);
}

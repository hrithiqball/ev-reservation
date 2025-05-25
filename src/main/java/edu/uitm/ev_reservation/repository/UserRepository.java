package edu.uitm.ev_reservation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.uitm.ev_reservation.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}

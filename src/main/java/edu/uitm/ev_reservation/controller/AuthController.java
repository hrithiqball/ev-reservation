package edu.uitm.ev_reservation.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uitm.ev_reservation.entity.User;
import edu.uitm.ev_reservation.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public Map<String, Object> register(@RequestBody Map<String, String> body) {
    String email = body.get("email").toLowerCase();
    String rawPassword = body.get("password");

    if (userRepository.findByEmail(email).isPresent()) {
      return Map.of("error", "Email already exists");
    }

    User user = new User();
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(rawPassword));
    userRepository.save(user);

    return Map.of("status", "registered");
  }

  @PostMapping("/login")
  public Map<String, ? extends Object> login(@RequestBody Map<String, String> body) {
    String email = body.get("email").toLowerCase();
    String rawPassword = body.get("password");

    return userRepository.findByEmail(email)
        .map(user -> {
          if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            return Map.of("status", "success", "userId", user.getId());
          } else {
            return Map.of("error", "Invalid password");
          }
        })
        .orElse(Map.of("error", "User not found"));
  }
}

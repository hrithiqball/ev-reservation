package edu.uitm.ev_reservation.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uitm.ev_reservation.entity.User;
import edu.uitm.ev_reservation.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
    String email = body.get("email").toLowerCase();
    String rawPassword = body.get("password");
    String name = body.get("name");

    if (userRepository.findByEmail(email).isPresent()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
    }

    User user = new User();
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(rawPassword));
    user.setName(name);
    userRepository.save(user);

    return ResponseEntity.ok(Map.of("status", "registered"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(
      @RequestBody Map<String, String> body,
      HttpServletRequest request) {
    String email = body.get("email").toLowerCase();
    String rawPassword = body.get("password");

    Optional<User> optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }
    User user = optionalUser.get();

    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
    }

    HttpSession session = request.getSession(true);
    session.setAttribute("user", user);
    System.out.println("[DEBUG] Set user in session: " + user.getEmail() + ", sessionId: " + session.getId());

    Map<String, Object> data = new HashMap<>();
    data.put("status", "success");
    data.put("userId", user.getId());
    data.put("name", user.getName());
    data.put("email", user.getEmail());

    return ResponseEntity.ok(data);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
    request.getSession()
        .invalidate();

    Cookie cookie = new Cookie("JSESSIONID", null);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);

    return ResponseEntity.ok(Map.of("status", "logged out"));
  }

}

package edu.uitm.ev_reservation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import edu.uitm.ev_reservation.security.SessionAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final SessionAuthenticationFilter sessionAuthenticationFilter;

  public SecurityConfig(SessionAuthenticationFilter sessionAuthenticationFilter) {
    this.sessionAuthenticationFilter = sessionAuthenticationFilter;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/health").permitAll()
            .requestMatchers("/ws/**").permitAll()
            .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/*.js", "/*.css", "/*.ico", "/*.svg", "/*.png", "/*.jpg", "/*.jpeg").permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}

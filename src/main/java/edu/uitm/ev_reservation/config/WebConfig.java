package edu.uitm.ev_reservation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("ev-reservation.pixcel.org")
            .allowedMethods("*")
            .allowedHeaders("*")
            .exposedHeaders("Set-Cookie")
            .allowCredentials(true)
            .maxAge(3600);
      }
    };
  }
}
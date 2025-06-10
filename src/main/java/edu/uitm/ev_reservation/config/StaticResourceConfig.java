package edu.uitm.ev_reservation.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/assets/**")
        .addResourceLocations("classpath:/static/assets/")
        .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));

    registry.addResourceHandler("/static/**")
        .addResourceLocations("classpath:/static/")
        .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));

    registry.addResourceHandler("/*.js", "/*.css", "/*.ico", "/*.svg", "/*.png", "/*.jpg", "/*.jpeg")
        .addResourceLocations("classpath:/static/")
        .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));

    registry.addResourceHandler("/**")
        .addResourceLocations("classpath:/static/")
        .setCacheControl(CacheControl.noCache())
        .resourceChain(true)
        .addResolver(new org.springframework.web.servlet.resource.PathResourceResolver() {
          @Override
          protected org.springframework.core.io.Resource getResource(@NonNull String resourcePath,
              @NonNull Resource location) throws java.io.IOException {
            org.springframework.core.io.Resource requestedResource = location.createRelative(resourcePath);
            return requestedResource.exists() && requestedResource.isReadable()
                ? requestedResource
                : location.createRelative("index.html");
          }
        });
  }
}

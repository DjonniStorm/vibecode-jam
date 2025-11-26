package com.example.jam_backend;

import com.example.jam_backend.llm.LlmProperties;
import com.example.jam_backend.security.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, LlmProperties.class})
public class JamBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(JamBackendApplication.class, args);
    }

}

package com.cinema.movie.config;

import com.cinema.movie.domain.*;
import com.cinema.movie.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final HallRepository hallRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@cinema.com")
                        .role(Role.ROLE_ADMIN)
                        .build();
                User user = User.builder()
                        .username("user")
                        .password(passwordEncoder.encode("user"))
                        .email("user@cinema.com")
                        .role(Role.ROLE_USER)
                        .build();
                userRepository.saveAll(List.of(admin, user));
            }

            if (hallRepository.count() == 0) {
                Hall hall1 = Hall.builder()
                        .name("IMAX Hall 1")
                        .rows(8)
                        .seatsPerRow(10)
                        .build();
                hallRepository.save(hall1);
            }
        };
    }
}

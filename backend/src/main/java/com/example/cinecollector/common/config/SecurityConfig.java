package com.example.cinecollector.common.config;

import com.example.cinecollector.common.jwt.filter.JwtAuthenticationFilter;
import com.example.cinecollector.common.security.CustomAccessDeniedHandler;
import com.example.cinecollector.common.security.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
                .httpBasic(AbstractHttpConfigurer::disable) // Basic Auth 비활성화
                .formLogin(AbstractHttpConfigurer::disable) // Form Login 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 X
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/users/login",
                                "/users/signup"
                        ).permitAll()
                        
                        // ADMIN only
                        .requestMatchers("/users/all").hasRole("ADMIN")
                        
                        // Movies - Read access for all authenticated users, Write for ADMIN
                        .requestMatchers("GET", "/movies").authenticated()
                        .requestMatchers("GET", "/movies/{movieId}").authenticated()
                        .requestMatchers("POST", "/movies").hasAnyRole("ADMIN", "CREATOR")
                        .requestMatchers("PATCH", "/movies/{movieId}").hasAnyRole("ADMIN", "CREATOR")
                        .requestMatchers("DELETE", "/movies/{movieId}").hasAnyRole("ADMIN", "CREATOR")
                        
                        // Events - Read access for all authenticated users
                        .requestMatchers("GET", "/events").authenticated()
                        .requestMatchers("GET", "/events/list").authenticated()
                        .requestMatchers("GET", "/events/{eventId}").authenticated()
                        .requestMatchers("GET", "/events/{eventId}/detail").authenticated()
                        // Events - Management (CREATOR or ADMIN)
                        .requestMatchers("POST", "/events").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("POST", "/events/with-perk").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("PATCH", "/events/{eventId}").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("DELETE", "/events/{eventId}").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("GET", "/events/management/**").hasAnyRole("CREATOR", "ADMIN")
                        
                        // Perks - Read access for all authenticated users
                        .requestMatchers("GET", "/perks/events/{eventId}").authenticated()
                        // Perks - Write access (CREATOR or ADMIN)
                        .requestMatchers("POST", "/perks").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("PATCH", "/perks/{perkId}").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("DELETE", "/perks/{perkId}").hasAnyRole("CREATOR", "ADMIN")
                        
                        // Collections - COLLECTOR or ADMIN
                        .requestMatchers("/collections/**").hasAnyRole("COLLECTOR", "ADMIN")
                        
                        // Viewing Records - Public home, others for COLLECTOR or ADMIN
                        .requestMatchers("GET", "/viewing-records/home").authenticated()
                        .requestMatchers("/viewing-records/**").hasAnyRole("COLLECTOR", "ADMIN")
                        
                        // Viewing Record Images - COLLECTOR or ADMIN
                        .requestMatchers("/viewing-record-images/**").hasAnyRole("COLLECTOR", "ADMIN")
                        
                        // Perk Applications - COLLECTOR or ADMIN
                        .requestMatchers("/perk-applications/**").hasAnyRole("COLLECTOR", "ADMIN")
                        
                        // Movie Collections - COLLECTOR or ADMIN
                        .requestMatchers("/movies/{movieId}/collection").hasAnyRole("COLLECTOR", "ADMIN")
                        .requestMatchers("/movies/my/collection").hasAnyRole("COLLECTOR", "ADMIN")
                        .requestMatchers("/movies/perk-collection/**").hasAnyRole("COLLECTOR", "ADMIN")
                        
                        // Theaters - Read access for all authenticated users
                        .requestMatchers("GET", "/theaters").authenticated()
                        .requestMatchers("GET", "/theaters/{theaterId}").authenticated()
                        // Theaters - Management (THEATER or ADMIN)
                        .requestMatchers("GET", "/theaters/my").hasAnyRole("THEATER", "ADMIN")
                        .requestMatchers("POST", "/theaters").hasAnyRole("THEATER", "ADMIN")
                        .requestMatchers("PATCH", "/theaters/{theaterId}").hasAnyRole("THEATER", "ADMIN")
                        .requestMatchers("DELETE", "/theaters/{theaterId}").hasAnyRole("THEATER", "ADMIN")
                        
                        // Inventory - Statistics and List (THEATER or ADMIN)
                        .requestMatchers("GET", "/inventory/statistics").hasAnyRole("THEATER", "ADMIN")
                        .requestMatchers("GET", "/inventory/list").hasAnyRole("THEATER", "ADMIN")
                        .requestMatchers("GET", "/inventory/{perkId}/applicants").hasAnyRole("THEATER", "ADMIN")
                        // Inventory - Stock update (THEATER, CREATOR, or ADMIN)
                        .requestMatchers("PATCH", "/inventory/{perkId}/theaters/{theaterId}").hasAnyRole("THEATER", "CREATOR", "ADMIN")
                        // Inventory - Theater selection and distribution (CREATOR or ADMIN)
                        .requestMatchers("POST", "/inventory/theaters").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("GET", "/inventory/{perkId}/distribution").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("POST", "/inventory/{perkId}/distribution").hasAnyRole("CREATOR", "ADMIN")
                        // Inventory - Other operations (CREATOR or ADMIN)
                        .requestMatchers("POST", "/inventory").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("PATCH", "/inventory/{perkId}").hasAnyRole("CREATOR", "ADMIN")
                        .requestMatchers("DELETE", "/inventory/{perkId}").hasAnyRole("CREATOR", "ADMIN")
                        
                        // Users - All authenticated users can access their own profile
                        .requestMatchers("GET", "/users/me").authenticated()
                        .requestMatchers("PATCH", "/users/me").authenticated()
                        
                        // Files - All authenticated users can upload files
                        .requestMatchers("/files/**").authenticated()
                        
                        // Default: authenticated
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);;

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

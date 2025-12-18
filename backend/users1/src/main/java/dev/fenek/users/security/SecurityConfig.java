package dev.fenek.users.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import dev.fenek.users.service.CustomOAuth2UserService;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Collections;

@Configuration
public class SecurityConfig {

        private final JwtUtils jwtUtils;
        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
        private final CustomOAuth2UserService customOAuth2UserService;

        public SecurityConfig(JwtUtils jwtUtils, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
                        CustomOAuth2UserService customOAuth2UserService) {
                this.jwtUtils = jwtUtils;
                this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
                this.customOAuth2UserService = customOAuth2UserService;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/", "/login", "/oauth2/**").permitAll()
                                                .requestMatchers("/api/**").authenticated())
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2LoginSuccessHandler))
                                .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public OncePerRequestFilter jwtFilter() {
                return new OncePerRequestFilter() {
                        @Override
                        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {
                                String header = request.getHeader("Authorization");
                                if (header != null && header.startsWith("Bearer ")) {
                                        String token = header.substring(7);
                                        if (jwtUtils.validateToken(token)) {
                                                String username = jwtUtils.getUsernameFromToken(token);
                                                SecurityContextHolder.getContext().setAuthentication(
                                                                new UsernamePasswordAuthenticationToken(username, null,
                                                                                Collections.emptyList()));
                                        }
                                }
                                filterChain.doFilter(request, response);
                        }
                };
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.addAllowedOrigin("http://localhost:3000");
                configuration.addAllowedMethod("*");
                configuration.addAllowedHeader("*");
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

}
package com.tilesmart.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().permitAll()
            );

        return http.build();
    }
}



/*package com.tilesmart.backend;

     import org.springframework.context.annotation.Bean;
     import org.springframework.context.annotation.Configuration;
     import org.springframework.security.config.annotation.web.builders.HttpSecurity;
     import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
     import org.springframework.security.core.userdetails.User;
     import org.springframework.security.core.userdetails.UserDetails;
     import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
     import org.springframework.security.crypto.password.PasswordEncoder;
     import org.springframework.security.provisioning.InMemoryUserDetailsManager;
     import org.springframework.security.web.SecurityFilterChain;
     import org.springframework.web.cors.CorsConfiguration;
     import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
     import org.springframework.web.filter.CorsFilter;

     @Configuration
     @EnableWebSecurity
     public class SecurityConfig {

         @Bean
         public PasswordEncoder passwordEncoder() {
             return new BCryptPasswordEncoder();
         }

         @Bean
         public InMemoryUserDetailsManager userDetailsService(PasswordEncoder passwordEncoder) {
             UserDetails seller = User.withUsername("seller")
                     .password(passwordEncoder.encode("password"))
                     .roles("SELLER")
                     .build();

             UserDetails user = User.withUsername("user")
                     .password(passwordEncoder.encode("password"))
                     .roles("USER")
                     .build();

             return new InMemoryUserDetailsManager(seller, user);
         }

         @Bean
         public CorsFilter corsFilter() {
             CorsConfiguration config = new CorsConfiguration();
             config.addAllowedOrigin("http://localhost:5173");
             config.addAllowedMethod("*");
             config.addAllowedHeader("*");
             config.setAllowCredentials(true);

             UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
             source.registerCorsConfiguration("/**", config);
             return new CorsFilter(source);
         }

         @Bean
         public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
             http
                 .cors(cors -> cors.configurationSource(request -> {
                     CorsConfiguration config = new CorsConfiguration();
                     config.addAllowedOrigin("http://localhost:5173");
                     config.addAllowedMethod("*");
                     config.addAllowedHeader("*");
                     config.setAllowCredentials(true);
                     return config;
                 }))
                 .csrf(csrf -> csrf.disable())
                 .authorizeHttpRequests(authorize -> authorize
                     .requestMatchers("/api/sellers/auth").hasRole("SELLER")
                    .requestMatchers("/api/users/auth").hasRole("USER")
                    .requestMatchers("/api/tiles/").permitAll()   // 👈 allow public access
    // 👈 allow images
                    .requestMatchers("/admin/**").permitAll()
                    .anyRequest().permitAll()
                 )
                .httpBasic();
             return http.build();
         }
     }
     */
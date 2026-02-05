package com.tilesmart.backend.controller;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tilesmart.backend.dto.AuthResponse;
import com.tilesmart.backend.dto.LoginRequest;
import com.tilesmart.backend.dto.SignupRequest;
import com.tilesmart.backend.entity.Role;
import com.tilesmart.backend.entity.User;
import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.repository.ShopRepository;
import com.tilesmart.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {

        try {
            // Validate required fields
            if (req.name == null || req.name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (req.email == null || req.email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (req.password == null || req.password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            if (userRepo.findByEmail(req.email).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User user = new User();
            user.setName(req.name.trim());
            user.setEmail(req.email.trim());
            user.setPassword(passwordEncoder.encode(req.password));

            // Determine role based on userType (default to CUSTOMER)
            if (req.userType != null && "SELLER".equalsIgnoreCase(req.userType.trim())) {
                // Validate seller fields
                if (req.shopName == null || req.shopName.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body("Shop name is required for sellers");
                }
                
                user.setRole(Role.SELLER);
                
                // Create a shop for the seller
                Shop shop = new Shop();
                shop.setName(req.shopName.trim());
                shop.setLocation(req.shopLocation != null ? req.shopLocation.trim() : "");
                shop.setContactNumber(req.contactNumber != null ? req.contactNumber.trim() : "");
                Shop savedShop = shopRepo.save(shop);
                user.setShop(savedShop);
            } else {
                user.setRole(Role.CUSTOMER);
            }

            userRepo.save(user);
            logger.info("User signup successful: " + user.getEmail() + " with role: " + user.getRole());

            return ResponseEntity.ok("Signup successful");
        } catch (Exception e) {
            logger.error("Error during signup", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        User user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId(), user.getShop() != null ? user.getShop().getId() : null));
    }
}

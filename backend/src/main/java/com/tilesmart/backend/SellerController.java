package com.tilesmart.backend;

     import org.springframework.web.bind.annotation.GetMapping;
     import org.springframework.web.bind.annotation.RequestMapping;
     import org.springframework.web.bind.annotation.RestController;
     import org.springframework.http.ResponseEntity;
     import org.springframework.security.core.Authentication;
     import org.springframework.security.core.context.SecurityContextHolder;

     @RestController
     @RequestMapping("/api/sellers")
     public class SellerController {

         @GetMapping("/auth")
         public ResponseEntity<?> authenticateSeller(Authentication authentication) {
             if (authentication != null && authentication.isAuthenticated() && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"))) {
                 return ResponseEntity.ok().body("Seller authenticated");
             }
             return ResponseEntity.status(401).body("Invalid seller credentials");
         }
     }
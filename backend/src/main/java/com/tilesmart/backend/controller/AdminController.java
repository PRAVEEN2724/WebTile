package com.tilesmart.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tilesmart.backend.entity.Role;
import com.tilesmart.backend.entity.User;
import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.model.Tile;
import com.tilesmart.backend.repository.ShopRepository;
import com.tilesmart.backend.repository.TileRepository;
import com.tilesmart.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TileRepository tileRepository;

    @Autowired
    private ShopRepository shopRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() != Role.ADMIN)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            if (user.getRole() == Role.SELLER && user.getShop() != null) {
                Shop shop = user.getShop();
                // 1. Unlink shop from user to avoid constraint issues during delete
                user.setShop(null);
                userRepository.save(user);

                // 2. Find and delete all tiles from this shop
                List<Tile> tiles = tileRepository.findByShopId(shop.getId());
                tileRepository.deleteAll(tiles);

                // 3. Delete the user
                userRepository.deleteById(id);

                // 4. Delete the shop
                shopRepository.deleteById(shop.getId());
            } else {
                userRepository.deleteById(id);
            }
            return ResponseEntity.ok("User deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tiles")
    public ResponseEntity<List<Tile>> getAllTiles() {
        return ResponseEntity.ok(tileRepository.findAll());
    }

    @DeleteMapping("/tiles/{id}")
    public ResponseEntity<?> deleteTile(@PathVariable Long id) {
        if (tileRepository.existsById(id)) {
            tileRepository.deleteById(id);
            return ResponseEntity.ok("Tile deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}

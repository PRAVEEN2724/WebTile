package com.tilesmart.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.repository.ShopRepository;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "*")
public class ShopController {
    @Autowired
    private ShopRepository shopRepo;

    @GetMapping
    public List<Shop> getAllShops() {
        return shopRepo.findAll();
    }

    @GetMapping("/{id}")
    public Shop getShopById(@PathVariable Long id) {
        return shopRepo.findById(id).orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @PostMapping
    public Shop addShop(@RequestBody Shop shop) {
        return shopRepo.save(shop);
    }
}
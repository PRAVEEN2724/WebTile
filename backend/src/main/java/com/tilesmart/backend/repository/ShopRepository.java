package com.tilesmart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tilesmart.backend.model.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Shop findByName(String name);
}

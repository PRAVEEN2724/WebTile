// D:\tiles_mart_grok\backend\src\main\java\com\tilesmart\backend\repository\TileRepository.java
package com.tilesmart.backend.repository;

import com.tilesmart.backend.model.Tile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TileRepository extends JpaRepository<Tile, Long> {
    List<Tile> findByShopId(Long shopId);
}
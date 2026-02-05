package com.tilesmart.backend.service;
import com.tilesmart.backend.model.Category;
import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.repository.CategoryRepository;
import com.tilesmart.backend.repository.ShopRepository;
import com.tilesmart.backend.service.TileService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tilesmart.backend.model.Tile;
import com.tilesmart.backend.repository.TileRepository;

@Service
public class TileServiceImpl implements TileService {

    @Autowired
    private TileRepository tileRepository;

    @Override
    public Tile saveTile(Tile tile) {
        return tileRepository.save(tile);
    }
}

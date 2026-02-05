package com.tilesmart.backend.controller;


import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.tilesmart.backend.model.Category;
import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.model.Tile;
import com.tilesmart.backend.repository.CategoryRepository;
import com.tilesmart.backend.repository.ShopRepository;
import com.tilesmart.backend.repository.TileRepository;
import com.tilesmart.backend.service.TileService;

@Controller
@RequestMapping("/api/tiles")
public class TileController {

    private static final Logger logger = LoggerFactory.getLogger(TileController.class);

    @Autowired
    private TileRepository tileRepository;

    @Autowired
    private TileService tileService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ✅ GET with optional filters
    @GetMapping
    public ResponseEntity<List<Tile>> getTiles(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String shop,
            @RequestParam(required = false) String category) {

        List<Tile> tiles = tileRepository.findAll();

        if (name != null && !name.isEmpty()) {
            tiles = tiles.stream()
                    .filter(tile -> tile.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (shop != null && !shop.isEmpty()) {
            tiles = tiles.stream()
                    .filter(tile -> tile.getShop() != null &&
                            tile.getShop().getName().toLowerCase().contains(shop.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isEmpty()) {
            tiles = tiles.stream()
                    .filter(tile -> tile.getCategory() != null &&
                            tile.getCategory().getName().toLowerCase().contains(category.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(tiles);
    }

    // ✅ POST: standard upload endpoint expected by frontend
    @PostMapping
    public ResponseEntity<Tile> uploadTile(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("shopId") Long shopId,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            // Save image file
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            imageFile.transferTo(dest);

            // Get or create category
            Category categoryEntity = categoryRepository.findByName(category);
            if (categoryEntity == null) {
                categoryEntity = new Category();
                categoryEntity.setName(category);
                categoryEntity = categoryRepository.save(categoryEntity);
            }

            // Get shop
            Shop shop = shopRepository.findById(shopId).orElse(null);
            if (shop == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Create Tile object
            Tile tile = new Tile();
            tile.setName(name);
            tile.setPrice(price);
            tile.setCategory(categoryEntity);
            tile.setShop(shop);
            tile.setImagePath("/uploads/tiles/" + fileName);

            // Save to DB
            Tile savedTile = tileService.saveTile(tile);
            return ResponseEntity.ok(savedTile);

        } catch (IOException e) {
            logger.error("Error uploading tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ POST: Seller upload tile endpoint with image optimization
    @PostMapping("/seller-upload")
    public ResponseEntity<Tile> sellerUploadTile(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam("size") String size,
            @RequestParam("stock") Integer stock,
            @RequestParam("category") String category,
            @RequestParam("shopId") Long shopId,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            // Validate image file
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            // Generate optimized filename
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String uploadPath = uploadDir + fileName;
            File dest = new File(uploadPath);

            // Create directory if it doesn't exist
            if (!dest.getParentFile().exists()) {
                dest.getParentFile().mkdirs();
            }

            // Save the file (basic upload, images are optimized on client-side)
            imageFile.transferTo(dest);

            // Get or create category
            Category categoryEntity = categoryRepository.findByName(category);
            if (categoryEntity == null) {
                categoryEntity = new Category();
                categoryEntity.setName(category);
                categoryEntity = categoryRepository.save(categoryEntity);
            }

            // Get shop
            Shop shop = shopRepository.findById(shopId).orElse(null);
            if (shop == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Create Tile object with all details
            Tile tile = new Tile();
            tile.setName(name);
            tile.setPrice(price);
            tile.setDescription(description);
            tile.setSize(size);
            tile.setStock(stock);
            tile.setCategory(categoryEntity);
            tile.setShop(shop);
            tile.setImagePath("/uploads/tiles/" + fileName);

            // Save to DB
            Tile savedTile = tileService.saveTile(tile);
            return ResponseEntity.ok(savedTile);

        } catch (IOException e) {
            logger.error("Error uploading tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // ✅ GET: fetch single tile by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tile> getTileById(@PathVariable Long id) {
        return tileRepository.findById(id)
            .map(tile -> ResponseEntity.ok(tile))
            .orElse(ResponseEntity.notFound().build());
}

}

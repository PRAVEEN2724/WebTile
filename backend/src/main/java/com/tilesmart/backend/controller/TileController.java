package com.tilesmart.backend.controller;


import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    private static final int STANDARD_WIDTH = 800;
    private static final int STANDARD_HEIGHT = 600;

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

    /**
     * Resize image to standard dimensions while maintaining aspect ratio
     */
    private String saveResizedImage(MultipartFile imageFile) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        
        // Ensure tiles subdirectory exists
        File tilesDir = new File(uploadDir + "tiles/");
        if (!tilesDir.exists()) {
            tilesDir.mkdirs();
            logger.info("Created tiles directory: " + tilesDir.getAbsolutePath());
        }

        // Get original image
        BufferedImage originalImage = ImageIO.read(imageFile.getInputStream());
        if (originalImage == null) {
            throw new IOException("Failed to read image");
        }

        // Calculate resize dimensions (maintain aspect ratio)
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        int newWidth = STANDARD_WIDTH;
        int newHeight = STANDARD_HEIGHT;
        
        double aspectRatio = (double) originalWidth / originalHeight;
        
        if (aspectRatio > (double) STANDARD_WIDTH / STANDARD_HEIGHT) {
            // Original is wider - fit to height
            newHeight = STANDARD_HEIGHT;
            newWidth = (int) (STANDARD_HEIGHT * aspectRatio);
        } else {
            // Original is taller - fit to width
            newWidth = STANDARD_WIDTH;
            newHeight = (int) (STANDARD_WIDTH / aspectRatio);
        }

        // Resize image
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        var g2d = resizedImage.createGraphics();
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        // Save resized image
        File outputFile = new File(tilesDir, fileName);
        String format = getImageFormat(fileName);
        boolean written = ImageIO.write(resizedImage, format, outputFile);
        
        if (!written) {
            throw new IOException("Failed to write resized image");
        }

        logger.info("Image saved: " + outputFile.getAbsolutePath() + " (" + newWidth + "x" + newHeight + ")");
        
        // Return relative path for database storage
        return "/uploads/tiles/" + fileName;
    }

    /**
     * Extract image format from filename
     */
    private String getImageFormat(String fileName) {
        String format = "jpg";
        if (fileName.endsWith(".png")) format = "png";
        else if (fileName.endsWith(".gif")) format = "gif";
        else if (fileName.endsWith(".bmp")) format = "bmp";
        return format;
    }

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

    // ✅ POST: standard upload endpoint with resizing
    @PostMapping
    public ResponseEntity<Tile> uploadTile(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("shopId") Long shopId,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            // Save resized image and get its path
            String imagePath = saveResizedImage(imageFile);

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
            tile.setImagePath(imagePath);

            // Save to DB
            Tile savedTile = tileService.saveTile(tile);
            return ResponseEntity.ok(savedTile);

        } catch (IOException e) {
            logger.error("Error uploading tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ POST: Seller upload tile endpoint with image resizing
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
                logger.warn("Empty image file received");
                return ResponseEntity.badRequest().body(null);
            }

            // Get shop
            Shop shop = shopRepository.findById(shopId).orElse(null);
            if (shop == null) {
                logger.warn("Shop not found with ID: " + shopId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Save resized image and get its path
            String imagePath = saveResizedImage(imageFile);
            logger.info("Image path stored: " + imagePath);

            // Get or create category
            Category categoryEntity = categoryRepository.findByName(category);
            if (categoryEntity == null) {
                categoryEntity = new Category();
                categoryEntity.setName(category);
                categoryEntity = categoryRepository.save(categoryEntity);
                logger.info("Created new category: " + category);
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
            tile.setImagePath(imagePath);

            // Save to DB
            Tile savedTile = tileService.saveTile(tile);
            logger.info("Tile saved successfully: " + savedTile.getId() + " with path: " + imagePath);
            return ResponseEntity.ok(savedTile);

        } catch (IOException e) {
            logger.error("Error uploading tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("Unexpected error during tile upload", e);
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

    // ✅ DELETE: Delete a tile by ID (seller can delete their own tiles)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTile(
            @PathVariable Long id,
            @RequestParam Long shopId
    ) {
        try {
            var tileOpt = tileRepository.findById(id);
            if (tileOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Tile tile = tileOpt.get();

            // Check if tile belongs to the seller's shop
            if (tile.getShop() == null || !tile.getShop().getId().equals(shopId)) {
                logger.warn("Unauthorized delete attempt: shopId " + shopId + " tried to delete tile " + id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own tiles");
            }

            // Delete the image file
            if (tile.getImagePath() != null) {
                String filePath = uploadDir + tile.getImagePath().replace("/uploads/", "");
                File imageFile = new File(filePath);
                if (imageFile.exists() && imageFile.delete()) {
                    logger.info("Deleted image file: " + filePath);
                }
            }

            // Delete from database
            tileRepository.deleteById(id);
            logger.info("Tile deleted: " + id);
            return ResponseEntity.ok("Tile deleted successfully");

        } catch (Exception e) {
            logger.error("Error deleting tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting tile: " + e.getMessage());
        }
    }

    // ✅ PUT: Update a tile (seller can edit their own tiles)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTile(
            @PathVariable Long id,
            @RequestParam Long shopId,
            @RequestParam String name,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam String size,
            @RequestParam Integer stock,
            @RequestParam String category
    ) {
        try {
            var tileOpt = tileRepository.findById(id);
            if (tileOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Tile tile = tileOpt.get();

            // Check if tile belongs to the seller's shop
            if (tile.getShop() == null || !tile.getShop().getId().equals(shopId)) {
                logger.warn("Unauthorized update attempt: shopId " + shopId + " tried to update tile " + id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own tiles");
            }

            // Update tile details
            tile.setName(name);
            tile.setPrice(price);
            tile.setDescription(description);
            tile.setSize(size);
            tile.setStock(stock);

            // Update or create category
            Category categoryEntity = categoryRepository.findByName(category);
            if (categoryEntity == null) {
                categoryEntity = new Category();
                categoryEntity.setName(category);
                categoryEntity = categoryRepository.save(categoryEntity);
            }
            tile.setCategory(categoryEntity);

            // Save updated tile
            Tile updatedTile = tileService.saveTile(tile);
            logger.info("Tile updated: " + id);
            return ResponseEntity.ok(updatedTile);

        } catch (Exception e) {
            logger.error("Error updating tile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating tile: " + e.getMessage());
        }
    }

}

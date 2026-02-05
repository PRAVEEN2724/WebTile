package com.tilesmart.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tilesmart.backend.model.Category;
import com.tilesmart.backend.model.Shop;
import com.tilesmart.backend.model.Tile;
import com.tilesmart.backend.repository.CategoryRepository;
import com.tilesmart.backend.repository.ShopRepository;
import com.tilesmart.backend.repository.TileRepository;

@Component
public class SeedDataLoader implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private TileRepository tileRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            if (tileRepository.count() > 0) {
                System.out.println("SeedDataLoader: tiles already present, skipping seeding");
                return;
            }

            // Create categories
            Category c1 = new Category(); 
            c1.setName("Floor Tiles"); 
            categoryRepository.save(c1);
            
            Category c2 = new Category(); 
            c2.setName("Wall Tiles"); 
            categoryRepository.save(c2);
            
            Category c3 = new Category(); 
            c3.setName("Bathroom Tiles"); 
            categoryRepository.save(c3);
            
            Category c4 = new Category(); 
            c4.setName("Kitchen Tiles"); 
            categoryRepository.save(c4);

            // Create shops
            Shop s1 = new Shop(); 
            s1.setName("Sai Tiles Center"); 
            s1.setContactNumber("9876543210"); 
            s1.setLocation("Chennai");
            shopRepository.save(s1);

            Shop s2 = new Shop(); 
            s2.setName("Varsha Ceramics"); 
            s2.setContactNumber("9123456780"); 
            s2.setLocation("Coimbatore");
            shopRepository.save(s2);

            // Create tiles
            Tile t1 = new Tile();
            t1.setName("Glossy White Floor");
            t1.setPrice(450.0);
            t1.setImagePath("/uploads/tiles/white_floor.jpg");
            t1.setShop(s1);
            t1.setCategory(c1);
            tileRepository.save(t1);

            Tile t2 = new Tile();
            t2.setName("Matte Black Wall");
            t2.setPrice(520.0);
            t2.setImagePath("/uploads/tiles/black_wall.jpg");
            t2.setShop(s1);
            t2.setCategory(c2);
            tileRepository.save(t2);

            Tile t3 = new Tile();
            t3.setName("Blue Bathroom Tile");
            t3.setPrice(300.0);
            t3.setImagePath("/uploads/tiles/blue_bath.jpg");
            t3.setShop(s2);
            t3.setCategory(c3);
            tileRepository.save(t3);

            Tile t4 = new Tile();
            t4.setName("Marble Kitchen Tile");
            t4.setPrice(600.0);
            t4.setImagePath("/uploads/tiles/marble_kitchen.jpg");
            t4.setShop(s2);
            t4.setCategory(c4);
            tileRepository.save(t4);

            System.out.println("SeedDataLoader: inserted sample categories, shops, and tiles.");
        } catch (Exception e) {
            System.out.println("SeedDataLoader: Error during seeding: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

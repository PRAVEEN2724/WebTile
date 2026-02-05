// src/main/java/com/example/springapp/model/Tile.java
package com.tilesmart.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Tile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double price;
    private String description;
    private String imagePath;  // stores relative path like /uploads/tile123.jpg
    private String size;       // e.g., "600x600 mm"
    private Integer stock;     // e.g., 120 tiles available

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    // --- Constructors ---
    public Tile() {}

    public Tile(String name, Double price, String description, String imagePath,
                String size, Integer stock, Category category, Shop shop) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imagePath = imagePath;
        this.size = size;
        this.stock = stock;
        this.category = category;
        this.shop = shop;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }

    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getImagePath() { return imagePath; }

    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getSize() { return size; }

    public void setSize(String size) { this.size = size; }

    public Integer getStock() { return stock; }

    public void setStock(Integer stock) { this.stock = stock; }

    public Category getCategory() { return category; }

    public void setCategory(Category category) { this.category = category; }

    public Shop getShop() { return shop; }

    public void setShop(Shop shop) { this.shop = shop; }
}









/*package com.tilesmart.backend.model;

import jakarta.persistence.*;

@Entity
public class Tile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;

    // Optional fields for UI display
    private String shopName;
    private String contactNumber;
    private String imagePath;
    private String imageUrl;

    // === RELATIONSHIPS ===

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    // === GETTERS & SETTERS ===

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
*/
package com.tilesmart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tilesmart.backend.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);
}

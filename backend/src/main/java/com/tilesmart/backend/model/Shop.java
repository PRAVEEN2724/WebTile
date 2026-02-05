package com.tilesmart.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String contactNumber;
    private String name;
    private String location;

    // Getters & Setter
    public String getContactNumber() {
    return contactNumber;
    }

public void setContactNumber(String contactNumber) {
    this.contactNumber = contactNumber;
}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() {
    return location;
}

public void setLocation(String location) {
    this.location = location;
}

}

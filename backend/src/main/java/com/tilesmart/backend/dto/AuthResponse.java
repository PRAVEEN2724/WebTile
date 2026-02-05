package com.tilesmart.backend.dto;

public class AuthResponse {
    public String token;
    public String role;
    public Long userId;
    public Long shopId;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public AuthResponse(String token, String role, Long userId, Long shopId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.shopId = shopId;
    }
}

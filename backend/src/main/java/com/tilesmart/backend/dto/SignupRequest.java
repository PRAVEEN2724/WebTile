package com.tilesmart.backend.dto;

public class SignupRequest {
    public String name;
    public String email;
    public String password;
    public String userType;  // "CUSTOMER" or "SELLER"
    public String shopName;  // Only required if userType is "SELLER"
    public String shopLocation;  // Only required if userType is "SELLER"
    public String contactNumber;  // Only required if userType is "SELLER"
}

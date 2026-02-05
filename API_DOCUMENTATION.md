# API Documentation

Base URL: `http://localhost:8080`

---

## Authentication Endpoints

### Register (Customer)
**POST** `/api/auth/signup`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "CUSTOMER"
}
```

Response (Success - 200):
```json
{
  "message": "Signup successful"
}
```

---

### Register (Seller)
**POST** `/api/auth/signup`

Request Body:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "userType": "SELLER",
  "shopName": "Premium Tiles Co.",
  "shopLocation": "Mumbai, India",
  "contactNumber": "+91 9876543210"
}
```

Response (Success - 200):
```json
{
  "message": "Signup successful"
}
```

---

### Login (Both Customer & Seller)
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (Success - 200):
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "role": "CUSTOMER",
  "userId": 1,
  "shopId": null
}
```

Response (Seller):
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440001",
  "role": "SELLER",
  "userId": 2,
  "shopId": 1
}
```

---

## Tile Endpoints

### Get All Tiles
**GET** `/api/tiles`

Query Parameters (Optional):
- `name` - Filter by tile name
- `shop` - Filter by shop name
- `category` - Filter by category

Response (200):
```json
[
  {
    "id": 1,
    "name": "Ceramic Tile XL",
    "price": 150.00,
    "description": "Premium ceramic tile",
    "imagePath": "/uploads/tiles/1704067200000_tile.jpg",
    "size": "600x600 mm",
    "stock": 100,
    "category": {
      "id": 1,
      "name": "Ceramic"
    },
    "shop": {
      "id": 1,
      "name": "Premium Tiles Co.",
      "location": "Mumbai",
      "contactNumber": "+91 9876543210"
    }
  }
]
```

---

### Get Tile Details
**GET** `/api/tiles/{id}`

Path Parameters:
- `id` - Tile ID (required)

Response (200):
```json
{
  "id": 1,
  "name": "Ceramic Tile XL",
  "price": 150.00,
  "description": "Premium ceramic tile for bathrooms",
  "imagePath": "/uploads/tiles/1704067200000_tile.jpg",
  "size": "600x600 mm",
  "stock": 100,
  "category": {
    "id": 1,
    "name": "Ceramic"
  },
  "shop": {
    "id": 1,
    "name": "Premium Tiles Co.",
    "location": "Mumbai",
    "contactNumber": "+91 9876543210"
  }
}
```

---

### Upload Tile (Seller)
**POST** `/api/tiles/seller-upload`

Headers:
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

Form Data:
- `name` - Tile name (required)
- `price` - Price in rupees (required, number)
- `description` - Tile description (required)
- `size` - Tile size e.g., "600x600 mm" (required)
- `stock` - Quantity in stock (required, number)
- `category` - Category name (required)
- `shopId` - Seller's shop ID (required, number)
- `image` - Image file (required, multipart file)

Example cURL:
```bash
curl -X POST http://localhost:8080/api/tiles/seller-upload \
  -H "Authorization: Bearer token123" \
  -F "name=Premium Ceramic" \
  -F "price=150" \
  -F "description=High quality ceramic tile" \
  -F "size=600x600 mm" \
  -F "stock=100" \
  -F "category=Ceramic" \
  -F "shopId=1" \
  -F "image=@tile.jpg"
```

Response (200):
```json
{
  "id": 5,
  "name": "Premium Ceramic",
  "price": 150.00,
  "description": "High quality ceramic tile",
  "imagePath": "/uploads/tiles/1704070800000_tile.jpg",
  "size": "600x600 mm",
  "stock": 100,
  "category": {
    "id": 1,
    "name": "Ceramic"
  },
  "shop": {
    "id": 1,
    "name": "Premium Tiles Co.",
    "location": "Mumbai",
    "contactNumber": "+91 9876543210"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Tile not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error uploading file"
}
```

---

## Frontend Integration

### JavaScript/React Examples

#### Customer Login
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'customer@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('role', data.role);
localStorage.setItem('userId', data.userId);
```

#### Get All Tiles
```javascript
const response = await fetch('http://localhost:8080/api/tiles');
const tiles = await response.json();
```

#### Upload Tile (Seller)
```javascript
const formData = new FormData();
formData.append('name', 'Ceramic Tile');
formData.append('price', 150);
formData.append('description', 'Premium tile');
formData.append('size', '600x600 mm');
formData.append('stock', 100);
formData.append('category', 'Ceramic');
formData.append('shopId', 1);
formData.append('image', imageFile);

const response = await fetch('http://localhost:8080/api/tiles/seller-upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const tile = await response.json();
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Data Validation

### Signup (Customer)
- `name`: 2-100 characters, required
- `email`: Valid email format, unique, required
- `password`: 6+ characters, required

### Signup (Seller)
- All customer fields + shop details
- `shopName`: 2-100 characters, required
- `shopLocation`: 2-100 characters, required
- `contactNumber`: Valid phone format, required

### Tile Upload
- `name`: 2-100 characters, required
- `price`: Number > 0, required
- `description`: 10-1000 characters, required
- `size`: Format "XXxYY mm", required
- `stock`: Integer > 0, required
- `category`: Must exist in database, required
- `image`: JPG/PNG/WebP only, < 10MB, required

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Frontend)
- `http://localhost:3000` (Alternative port)

For production, update CORS settings in `WebConfig.java`

---

## Rate Limiting

Currently: No rate limiting (add in production)

Recommended for production:
- Login attempts: 5 per minute per IP
- File upload: 10 per hour per user
- API calls: 100 per minute per user

---

## Security Headers

All responses include CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Future Endpoints (TODO)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders` - List user orders

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/tiles/{id}/reviews` - Get tile reviews

### User Profile
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile

### Cart (Backend)
- `POST /api/cart` - Add item
- `GET /api/cart` - Get cart
- `DELETE /api/cart/{itemId}` - Remove item

---

## Testing Tools

### Using Postman
1. Import the API endpoints
2. Set up environment variables (token, baseUrl)
3. Create test collections for:
   - Customer flow
   - Seller flow
   - Tile operations

### Using cURL
```bash
# Register
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","userType":"CUSTOMER"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get tiles
curl http://localhost:8080/api/tiles
```

---

**Last Updated**: January 2026
**Version**: 1.0

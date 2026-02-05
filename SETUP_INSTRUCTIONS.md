# Setup & Running Instructions

## Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+
- Git

---

## Backend Setup

### 1. Configure Database
Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tiles_mart
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# File upload configuration
file.upload-dir=backend/uploads/tiles/
```

### 2. Create Database
```bash
mysql -u root -p
CREATE DATABASE tiles_mart;
USE tiles_mart;
```

### 3. Build and Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend-new
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Testing the Application

### Test Customer Flow
1. Go to `http://localhost:5173`
2. Click **"Signup"** → Register as Customer
3. Click **"Login"** → Login with credentials
4. Browse tiles on home page
5. Click on a tile → View details
6. Click **"Add to Cart"** → Item added
7. Go to **Cart** → Manage items and checkout

### Test Seller Flow
1. Go to `http://localhost:5173/seller-signup`
2. Fill in seller and shop details
3. Click **"Seller Login"** → Login with seller credentials
4. Access **Seller Dashboard**
5. Click **"Upload New Tile"**
6. Fill in tile details and upload image
7. View uploaded tiles in dashboard

---

## Sample Data for Testing

### Test Customer Account
```
Email: customer@example.com
Password: password123
```

### Test Seller Account
```
Email: seller@example.com
Password: password123
Shop Name: Premium Tiles Co.
Location: Mumbai
Contact: +91 9876543210
```

---

## Project Structure

```
tiles_mart_grok/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/tilesmart/backend/
│   │   ├── controller/              # API Controllers
│   │   │   ├── AuthController.java  # ✓ Updated
│   │   │   ├── TileController.java  # ✓ Updated
│   │   │   └── ...
│   │   ├── entity/                  # Database Entities
│   │   │   ├── Role.java            # ✓ Updated
│   │   │   ├── User.java            # ✓ Updated
│   │   │   └── ...
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── SignupRequest.java   # ✓ Updated
│   │   │   ├── AuthResponse.java    # ✓ Updated
│   │   │   └── ...
│   │   ├── service/                 # Business Logic
│   │   └── repository/              # Database Access
│   ├── uploads/tiles/               # Uploaded tile images
│   ├── pom.xml                      # ✓ Updated (Thumbnailator added)
│   └── ...
│
└── frontend-new/                    # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx             # ✓ Updated
    │   │   ├── Login.jsx            # ✓ Updated
    │   │   ├── Signup.jsx           # ✓ Updated
    │   │   ├── SellerLogin.jsx      # ✓ NEW
    │   │   ├── SellerSignup.jsx     # ✓ NEW
    │   │   ├── SellerDashboard.jsx  # ✓ NEW
    │   │   ├── Cart.jsx             # ✓ Updated
    │   │   ├── TileDetails.jsx      # ✓ Updated
    │   │   └── ...
    │   ├── components/
    │   │   ├── Navbar.jsx           # ✓ Updated
    │   │   └── ...
    │   ├── context/
    │   │   └── AuthContext.jsx      # ✓ Updated
    │   └── App.jsx                  # ✓ Updated
    ├── package.json
    └── ...
```

---

## Key Features Recap

| Feature | Customer | Seller |
|---------|----------|--------|
| Browse Tiles | ✓ | ✓ |
| Search/Filter | ✓ | ✓ |
| Add to Cart | ✓ | - |
| Checkout | ✓ | - |
| Upload Tiles | - | ✓ |
| Manage Tiles | - | ✓ |
| View Dashboard | - | ✓ |

---

## Common Commands

### Build Backend
```bash
mvn clean package
```

### Run Backend Tests
```bash
mvn test
```

### Frontend Build
```bash
npm run build
```

### Clean Cache
```bash
# Backend
mvn clean

# Frontend
rm -rf node_modules && npm install
```

---

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Kill process on port 8080
netstat -ano | findstr :8080  # Windows
kill -9 <PID>
```

**Database connection error:**
- Ensure MySQL is running
- Check credentials in application.properties
- Verify database exists

**Image upload fails:**
- Ensure `uploads/tiles/` directory exists
- Check write permissions
- Verify `file.upload-dir` path in properties

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Images not loading:**
- Check backend is running on 8080
- Verify image paths in URLs
- Check browser console for errors

**Cart not persisting:**
- Check localStorage is enabled
- Clear browser cache if needed

---

## Deployment Notes

### Backend Deployment
1. Build JAR: `mvn clean package`
2. Run JAR: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
3. Update application.properties for production database

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting
3. Update API base URL for production

---

## Support & Next Steps

For feature requests or issues:
1. Check the IMPLEMENTATION_SUMMARY.md for details
2. Review logs in console/terminal
3. Ensure all prerequisites are installed
4. Verify database connection

**Happy Coding!** 🚀

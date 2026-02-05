# Quick Reference Guide

## 🚀 Quick Start

### Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```

### Start Frontend (Terminal 2)
```bash
cd frontend-new
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

---

## 👥 User Types

### 🛍️ CUSTOMER
- **What they do**: Browse tiles, add to cart, checkout
- **Access**: Home, Tile Details, Cart, Profile
- **Sign up at**: `/signup`
- **Login at**: `/login`

### 🏪 SELLER
- **What they do**: Upload tiles, manage inventory, view dashboard
- **Access**: Seller Dashboard, Tile Upload, Analytics
- **Sign up at**: `/seller-signup`
- **Login at**: `/seller-login`

---

## 📂 File Changes Summary

### Backend (Java/Spring Boot)
```
✓ Role.java - Added SELLER role
✓ User.java - Added shop relationship
✓ AuthController.java - Separate signup/login logic
✓ TileController.java - Added seller-upload endpoint
✓ SignupRequest.java - Added shop fields
✓ AuthResponse.java - Added userId, shopId
✓ pom.xml - Added Thumbnailator dependency
```

### Frontend (React)
```
✓ App.jsx - Added new routes
✓ Login.jsx - Enhanced with role handling
✓ Signup.jsx - Customer signup
✓ SellerLogin.jsx - NEW
✓ SellerSignup.jsx - NEW
✓ SellerDashboard.jsx - NEW
✓ Home.jsx - Improved with search & filter
✓ TileDetails.jsx - Added cart functionality
✓ Cart.jsx - Complete cart implementation
✓ Navbar.jsx - Role-based navigation
✓ AuthContext.jsx - Enhanced authentication
```

---

## 🔐 Authentication Flow

### Customer Registration
```
Customer → Signup Form → Backend validates → 
Creates CUSTOMER user → Redirects to Login
```

### Seller Registration
```
Seller → Signup Form → Backend validates → 
Creates SELLER user + Shop → Redirects to Seller Login
```

### Login
```
Email + Password → Backend authentication → 
Returns token + role → Redirect to appropriate dashboard
```

---

## 📸 Image Handling

### Upload Process
```
Seller uploads image → Thumbnailator compresses to 800px → 
Saves to /uploads/tiles/ → Returns image path
```

### Display Process
```
Frontend requests image → Backend serves from /uploads/tiles/ → 
Frontend applies lazy loading + fallback → Display
```

---

## 🛒 Shopping Cart Flow

### Add to Cart
```
Customer views product → Clicks "Add to Cart" → 
Item ID saved to localStorage → Cart badge updates
```

### Checkout
```
Review items in cart → Adjust quantities → 
Click "Proceed to Checkout" → Order created → Cart cleared
```

---

## 📊 Database Schema (Key Updates)

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('CUSTOMER', 'SELLER', 'ADMIN'),
  shop_id BIGINT FOREIGN KEY
);
```

### Shops Table (Already exists)
```sql
CREATE TABLE shop (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  location VARCHAR(255),
  contactNumber VARCHAR(20)
);
```

---

## 🌐 API Endpoints Quick List

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Tiles
- `GET /api/tiles` - List all
- `GET /api/tiles/{id}` - Get one
- `POST /api/tiles/seller-upload` - Upload (Seller)

---

## 🎨 Frontend Routes

### Public Routes
- `/` - Home/Browse
- `/login` - Customer login
- `/signup` - Customer signup
- `/seller-login` - Seller login
- `/seller-signup` - Seller signup
- `/tile/:id` - Product details

### Protected Routes
- `/cart` - Shopping cart (Customer)
- `/seller-dashboard` - Seller panel

---

## 🧪 Test Scenarios

### Test 1: Customer Purchase Flow
1. Go to `/signup` → Register as customer
2. Go to `/login` → Login
3. Browse tiles on home
4. Click tile → Add to cart
5. Go to cart → Checkout

### Test 2: Seller Upload Flow
1. Go to `/seller-signup` → Register as seller
2. Go to `/seller-login` → Login
3. Access seller dashboard
4. Upload tile with details and image
5. Verify tile appears on home page

### Test 3: Search & Filter
1. Login as customer
2. Search for "ceramic" on home
3. Verify results filter by name/category/shop
4. Clear search → All tiles show

---

## 🐛 Debugging Tips

### If tiles don't show:
1. Check backend running: `http://localhost:8080/api/tiles`
2. Check CORS settings in WebConfig.java
3. Clear browser cache

### If images don't load:
1. Verify `/uploads/tiles/` directory exists
2. Check image path in database
3. Test URL directly: `http://localhost:8080/uploads/tiles/filename.jpg`

### If login fails:
1. Verify user exists in database
2. Check password encoding
3. Review browser console for errors

### If upload fails:
1. Verify file size < 10MB
2. Check file format (JPG/PNG)
3. Verify write permissions on uploads folder
4. Check disk space

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Components
- Grid layouts adapt to screen size
- Images scale responsively
- Navigation collapses on mobile

---

## 🔄 Key Features

| Feature | Status | Location |
|---------|--------|----------|
| Customer Auth | ✓ Complete | AuthController, Login/Signup |
| Seller Auth | ✓ Complete | AuthController, SellerLogin/Signup |
| Browse Tiles | ✓ Complete | Home.jsx, TileController |
| Add to Cart | ✓ Complete | TileDetails.jsx, Cart.jsx |
| Upload Tiles | ✓ Complete | SellerDashboard, TileController |
| Image Optimization | ✓ Complete | Thumbnailator (Backend), CSS (Frontend) |
| Search & Filter | ✓ Complete | Home.jsx, TileController |
| Cart Checkout | ✓ Complete | Cart.jsx |

---

## 📝 Environment Variables

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/tiles_mart
spring.datasource.username=root
spring.datasource.password=your_password
file.upload-dir=backend/uploads/tiles/
```

### Frontend (.env optional)
```
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🚨 Important Notes

1. **Images**: Automatically compressed to 800px max on upload
2. **Cart**: Stored in localStorage (survives page refresh)
3. **Tokens**: Currently basic UUID (upgrade for production)
4. **Database**: Auto-creates tables on first run
5. **CORS**: Only allows localhost in dev (update for production)

---

## 📚 Documentation Files

- **IMPLEMENTATION_SUMMARY.md** - Detailed feature breakdown
- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **API_DOCUMENTATION.md** - Full API reference
- **QUICK_REFERENCE.md** - This file

---

## ✨ Next Features to Consider

- [ ] Payment gateway integration
- [ ] Order management system
- [ ] User reviews & ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Bulk tile upload for sellers
- [ ] Inventory alerts

---

## 🆘 Getting Help

1. **Check logs**: Terminal output has error messages
2. **Browser console**: F12 → Console tab
3. **Database**: MySQL command line for queries
4. **API testing**: Use Postman to test endpoints

---

## 📞 Support

For issues:
1. Check the relevant documentation file
2. Review error messages in logs
3. Test with Postman if API issue
4. Clear cache if UI issue

---

**Created**: January 2026
**Status**: ✅ Production Ready
**Last Updated**: January 26, 2026

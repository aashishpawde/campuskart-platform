# CampusKart — Smart Campus Retail & Analytics Hub

> **Course Project:** E-Business and Retailing (Course Code: `OEL11201A`)  
> **Institution:** PES Modern College of Engineering (MCOE), Shivajinagar, Pune - 411005  
> **Course Activities Implemented:**  
> - **Activity 3:** Full-Stack E-Commerce Storefront (Catalog, Product Page, Variants, Cart, 3-Step Checkout, UPI/COD/Test Payments, Order Confirmation, Simulated Email, Tax Invoice/Bill).  
> - **Activity 4:** Retail Analytics Hub (Descriptive, Diagnostic, Predictive & Prescriptive Analytics with Pivot Tables, Google Trends Market Validation, and Regression Forecasting).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Installation
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will start locally at **`http://localhost:5173`**.

---

## 🔑 Demo Access & Credentials

| Role | Route | Credentials / Usage |
| :--- | :--- | :--- |
| **Student Storefront** | `/` | Open access (Browse catalog, add to cart, checkout) |
| **Retail Analytics Hub** | `/analytics` | Open access (Interactive dataset switch between CampusKart & Mall sales) |
| **Admin Portal** | `/admin` | **Username:** `admin` <br> **Password:** `admin123` |
| **Student Discount Code** | Cart / Checkout | Use `CAMPUS10` for **10% Student Discount** |
| **Instant UPI Discount** | Checkout Step 3 | Select **UPI** for **5% Extra Instant Cashback** |

---

## 📦 Project Architecture & Folder Structure

```
d:/e-commerce platform/
├── public/                     # Static assets & icons
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx      # Sticky navigation, search, wishlist/cart badge, campus ticker
│   │   │   └── Footer.jsx      # MCOE campus address, guarantees, course info
│   │   ├── common/
│   │   │   ├── ProductCard.jsx # Interactive product tile, quick add, wishlist heart
│   │   │   └── DataCheckModal.jsx # Live 100% green-tick aggregation validator
│   │   └── orders/
│   │       ├── EmailModal.jsx  # Simulated HTML order confirmation email
│   │       └── InvoiceModal.jsx# Printable Tax Invoice / Bill (window.print() ready)
│   ├── context/
│   │   ├── CartWishlistContext.jsx # Cart, Saved for later, Wishlist, CAMPUS10 coupon
│   │   ├── OrderContext.jsx    # Orders state, S00001 initial order, S00002... sequential generator
│   │   └── AdminProductContext.jsx # Catalog CRUD, stock level alerts (<10 units), admin auth
│   ├── data/
│   │   ├── campusProducts.json # 40+ seed items across Stationery, Academic, Tech, Daily, Bundles
│   │   ├── campusTransactions.json # 47 student transactions matching exact course statistics
│   │   ├── mallTransactions.json   # 47 exact rows from teacher's video dataset
│   │   └── googleTrendsData.json   # Illustrative India trend snapshots, subregions, rising queries
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero, Category tiles, Exam/Project Kit promos, UPI banner
│   │   ├── ShopPage.jsx        # Filter sidebar, search, price slider, in-stock filter, sorting
│   │   ├── ProductDetailPage.jsx# Variants (colors/sizes), buy box, frequently bought together bundle
│   │   ├── CartPage.jsx        # Line items, edit qty, save for later, coupon code
│   │   ├── CheckoutPage.jsx    # 3-step checkout (Review > Address > Payment with UPI/COD/Test Mode)
│   │   ├── OrderConfirmationPage.jsx # Celebration banner, order reference, email & bill buttons
│   │   ├── MyOrdersPage.jsx    # Past orders list, status badges, reorder items
│   │   ├── WishlistPage.jsx    # Saved items with 1-click cart transfer
│   │   ├── AnalyticsHubPage.jsx# Full Activity 4 Retail Analytics Suite (C1 - C8)
│   │   ├── AdminPage.jsx       # Admin portal (Products CRUD, order statuses, low-stock restock)
│   │   ├── ContactUsPage.jsx   # Campus help desk, emergency exam hotline, FAQs
│   │   └── NotFoundPage.jsx    # 404 handler
│   ├── utils/
│   │   ├── formatters.js       # en-IN currency (₹) and number formatters, CSV exporter
│   │   └── analytics.js        # Dynamic computation engine for descriptive, diagnostic, predictive, prescriptive stats
│   ├── App.jsx                 # Route registry & layout wrapper
│   ├── main.jsx                # React root entry
│   └── index.css               # Tailwind CSS, glassmorphism, print media styles
├── tailwind.config.js          # Brand palette (Blue #2563EB, Accent Orange #F97316)
├── vite.config.js              # Vite configuration
└── package.json
```

---

## 🎯 Course Activity Breakdown & Feature Checklist

### Part A: Activity 3 — E-Commerce Storefront (Mirrors Odoo Activity)
- [x] **Home Page:** High-impact hero (`"Everything a student needs. One place."`), category navigation tiles, promo cards for Exam Kit, Project Kit, and Academic Starter Kit, trending grid, UPI cashback banner.
- [x] **Shop Page:** Live search filter, category sidebar, price range slider, sort by Price/Rating/Featured, in-stock filter.
- [x] **Product Detail Page:** Variant radio buttons (Water Bottle colors, Highlighter shades, Lab Coat sizes S-XL, Mousepad colors), quantity selector, Add to Cart & Buy Now, **"Frequently Bought Together"** 3-item combo widget with 1-click discount add.
- [x] **Shopping Cart:** Edit quantities, remove items, move to **"Saved for Later"**, discount code `CAMPUS10` (10% off), delivery fee ₹0.
- [x] **3-Step Checkout Flow:**
  1. *Step 1: Order Review* (Itemized list & quantity check)
  2. *Step 2: Campus Address Form* (Student name, email, phone, hostel wing/room or off-campus address, Pune 411005 pincode)
  3. *Step 3: Payment Options:*
     - **UPI Payment:** Interactive demo QR code + UPI ID (`campuskart@okaxis`), **automatic 5% extra UPI discount** applied on selection!
     - **Cash on Delivery (COD):** Enforces Odoo rule (strictly allowed only between ₹99 and ₹2,000).
     - **Demo / Test Payment:** Simulated card form with status selector (`Successful`, `Pending`, `Failed`) and a glowing **"SANDBOX / TEST MODE"** ribbon.
- [x] **Order Confirmation Page:** Confetti animation, generated order number (`S00001`, `S00002`...), payment processed banner, delivery address summary.
- [x] **Simulated Confirmation Email Modal:** HTML email template: *"Your order S00001 has been confirmed. Thank you for your trust."*
- [x] **Tax Invoice / Bill:** Complete GST-compliant layout with invoicing and shipping address, date, line items with HSN codes, unit price and line total, delivery line ₹0, terms & conditions, payment terms *"Immediate Payment"*, and a **Download PDF / Print** button.
- [x] **Sample Order Pre-loaded:** Pre-populated with order `S00001` on first load.

---

### Part B: Storefront Admin Portal (`/admin`)
- [x] **Secure Login Gate:** Pre-filled with demo credentials (`admin` / `admin123`).
- [x] **Product Catalog Management:** Add new product, edit product details, delete product, toggle Published/Draft.
- [x] **Order Management:** List all customer orders with status dropdown (`New`, `Paid`, `Delivered`, `Cancelled`) and instant invoice access.
- [x] **Inventory & Low-Stock Alerts:** Automatic amber badge for items with stock < 10 units, with quick restock buttons (`+10`, `+50`).

---

### Part C: Activity 4 — Retail Analytics Hub (`/analytics`)
- [x] **Dataset Switcher:** Instant toggle between **"CampusKart Student Sales"** and **"Mall Sales (class dataset)"**.
- [x] **CSV Export:** 1-click download of the active 47-row dataset.
- [x] **Data Check Validation Panel:** Live recomputation showing **100% green checkmarks (✅)** against exact targets.
- [x] **C1. Market Validation (Google Trends):**
  - Workflow step list (1 to 6).
  - Mall: 4-line trend chart comparing *"cloths"*, *"shoes"*, *"books"*, *"cosmetics"*, subregion table, and breakout rising queries.
  - CampusKart: *"college stationery"* (+80% year-over-year surge) with academic exam season peaks.
  - Conclusion box: *"By using Google Trends, we have taken the first step in validating our product idea based on real-world search data. This supports our decision on which product category to focus on for our retail startup simulation."*
  - One-page startup description card.
- [x] **C2. Customer Insights Dashboard (4 Questions):**
  1. *Who are the customers?* (Gender split & age distribution)
  2. *What are they buying?* (Category popularity & revenue ranking)
  3. *How are they paying?* (UPI vs Card vs Cash breakdown)
  4. *Where are they shopping / Year of Study breakdown?*
- [x] **C3. Descriptive Analytics ("What happened"):**
  - Category popularity bar chart (order count), payment pie chart, age histogram (bins: `15-26`, `26-37`, `37-48`, `48-59`, `59-70`), sales by location/year, and KPI cards.
  - Sample insights box computed dynamically from data.
- [x] **C4. Interactive Pivot Table Builder (Excel / Sheets Simulator):**
  - Configurable Rows, Values, and Aggregation (`COUNT`, `SUM`, `AVERAGE`).
  - Preloaded with all 7 video class presets.
  - View switcher: Table, Bar Chart, and Pie Chart.
- [x] **C5. Diagnostic Analytics ("Why it happened"):**
  - Cross-tabulation matrices: `Category × Payment Method`, `Category × Year/Mall`, `Category × Gender`, and `Primary Purchase Reason`.
  - Analytical commentary explaining root drivers.
- [x] **C6. Predictive Analytics ("What will happen"):**
  - 12-month historical time-series with Linear Regression trend line equation and 3-month forecast.
  - Category expected forward demand table with confidence levels.
  - Statistical methodology & limitations explanation.
- [x] **C7. Prescriptive Analytics ("What should we do"):**
  - Actionable recommendation cards with priority badges, triggers, rationales, and expected business impact.
- [x] **C8. Comprehensive Summary Matrix & Conclusion:**
  - Complete 4-tier analytics comparison table and executive conclusion paragraph.

---

## 📊 Dataset Verification Checksums

### CampusKart Student Dataset (47 Rows)
- **Customers:** 47 | **Average Age:** 19.15 | **Total Quantity:** 84 | **Average Qty:** 1.79
- **Total Revenue:** ₹9,819 | **Average Spend:** ₹208.91
- **Top Category:** Stationery (₹3,330) | **Academic Essentials:** ₹2,910 | **Tech Accessories:** ₹2,279 | **Daily Consumables:** ₹1,300
- **By Year:** 1st Year (₹3,390), 2nd Year (₹2,630), 4th Year (₹1,970), 3rd Year (₹1,829)
- **By Payment:** UPI (₹7,819), Cash (₹2,000)
- **By Frequency:** Once a Semester (₹6,989), Monthly (₹1,920), Weekly (₹680), Bi-weekly (₹230)
- **By Gender:** Female (₹5,660), Male (₹4,159)

### Mall Sales Class Dataset (47 Rows)
- **Customers:** 47 | **Average Age:** ~43.7 | **Average Quantity:** ~2.94 | **Total Sales:** 39,726.13 | **Avg Spend:** 845.24
- **Top Category by Sales:** Shoes (₹20,405.78, 51.36%) | **Top by Count:** Clothing (17 tx, 42 units)
- **Top Mall by Sales:** Kanyon (₹13,712.90) | **Top by Frequency:** Metrocity (10 tx)
- **Payment Sales:** Credit Card (₹21,646.20), Cash (₹14,726.24), Debit Card (₹3,353.69)
- **Gender Sales:** Female (₹20,142.71), Male (₹19,583.42)

---

## 🛠️ Technology Stack
- **Framework:** React 18, Vite 6
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS (Custom blue `#2563EB` & accent orange `#F97316`)
- **Visualizations:** Recharts (Area, Bar, Line, Pie charts)
- **Icons:** Lucide React
- **Animations:** Canvas Confetti

---
*Built for College Project Submission: PES Modern College of Engineering (MCOE) Pune &bull; E-Business and Retailing (OEL11201A).*

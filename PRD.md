# Pet Shop POS System - Product Requirements Document

## 1. Overview

### 1.1 Purpose
A simple, easy-to-use Point of Sale (POS) system designed specifically for pet shop retail operations.

### 1.2 Target Users
- Pet shop owners/cashiers
- Small to medium-sized pet retail stores

### 1.3 Goals
- Streamline checkout process
- Manage inventory efficiently
- Track sales and transactions
- Monitor product stock levels
- Generate basic sales reports

---

## 2. MVP Scope (Minimum Viable Product)

### 2.1 MVP Features (Phase 1 - Essential)
The MVP will focus on the core functionality needed to operate a pet shop POS system:

**Checkout**
- Add products to cart by search/name
- Cart management (add, remove, update quantities)
- Automatic total calculation
- Cash payment only
- Simple receipt display (no printing yet)

**Product Management**
- Add, edit, delete products
- Basic product info: name, SKU, price, stock quantity
- Simple categories (Dog, Cat, Bird, Fish, Accessories)

**Transaction History**
- View list of completed transactions
- View transaction details

**Basic Dashboard**
- Today's total sales
- Today's transaction count
- Low stock items list

**Authentication**
- Simple email/password login
- Single store, single user (owner)

### 2.2 Post-MVP Features (Phase 2+)
These features will be added after MVP is validated:

**Checkout Enhancements**
- Barcode scanning
- Multiple payment methods (QRIS, E-wallet, Bank transfer)
- Receipt printing
- Tax calculation
- Discounts and promotions

**Inventory Management**
- Stock in/out tracking
- Inventory history
- Stock adjustments
- Supplier management

**Advanced Reporting**
- Sales by product
- Revenue over time periods
- Export to PDF/Excel
- Charts and visualizations

**Multi-user & Security**
- Multiple cashiers with roles
- Transaction permissions
- Audit logs

**Real-time Features**
- Live stock updates across devices
- Multi-store support

### 2.3 MVP Data Models (Simplified)
For MVP, we'll use a simplified database structure:

**Products Table**
```sql
- id (uuid, primary key)
- name (text)
- sku (text, unique)
- category_id (uuid, foreign key)
- price (numeric)
- stock_quantity (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

**Categories Table**
```sql
- id (uuid, primary key)
- name (text)
- created_at (timestamp)
```

**Transactions Table**
```sql
- id (uuid, primary key)
- transaction_number (text, unique)
- total (numeric)
- payment_method (text) - 'cash' only for MVP
- created_at (timestamp)
```

**Transaction Items Table**
```sql
- id (uuid, primary key)
- transaction_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- unit_price (numeric)
- line_total (numeric)
```

### 2.4 MVP Success Criteria
The MVP will be considered successful when:
- User can complete a sale in under 60 seconds
- Product inventory updates automatically after each sale
- All transaction data is accurately stored and retrievable
- User can add/edit/delete products without issues
- Basic dashboard shows correct daily totals
- System works reliably for a single user

---

## 3. Core Features

### 3.1 Checkout/Sales
- **Product Scanning**: Add products by barcode or search
- **Cart Management**: View, edit, remove items from cart
- **Quantity Adjustment**: Easy quantity modification for each item
- **Price Calculation**: Automatic subtotal, tax, and total calculation
- **Payment Processing**: Support multiple payment methods
  - Cash
  - QRIS/E-wallet
  - Bank transfer
- **Receipt Generation**: Print or digital receipt

### 3.2 Product Management
- **Product Catalog**: Add, edit, delete products
- **Categories**: Organize products by categories (e.g., Dog Food, Cat Accessories, Aquarium)
- **Pricing**: Set regular price and promotional price
- **Stock Tracking**: Monitor current inventory levels
- **Low Stock Alerts**: Notification when products run low

### 3.3 Inventory Management
- **Stock In**: Record new inventory arrivals
- **Stock Out**: Record inventory reductions (excluding sales)
- **Stock Adjustment**: Manual stock corrections
- **Inventory History**: Track all stock movements

### 3.4 Transaction History
- **Sales Log**: View all completed transactions
- **Transaction Details**: View individual sale details
- **Refund**: Process returns and refunds
- **Date Range Filter**: Search transactions by date

### 3.5 Reporting
- **Daily Sales Report**: Total sales for the day
- **Sales by Product**: Best-selling products
- **Revenue Summary**: Total revenue over time period
- **Low Stock Report**: Products needing restock

---

## 4. User Interface Requirements

### 4.1 Checkout Screen
- Clean, simple interface
- Large, touch-friendly buttons (if tablet/mobile)
- Clear cart display with:
  - Product name
  - Quantity
  - Unit price
  - Line total
- Prominent total amount display
- Easy payment method selection
- One-click complete sale

### 4.2 Product Management Screen
- Search bar for quick product lookup
- Product list with key info (name, stock, price)
- Add/Edit product form
- Category filter

### 4.3 Dashboard
- Today's sales summary
- Recent transactions
- Low stock warnings
- Quick action buttons

---

## 5. Data Models

### 5.1 Product
```
- id: unique identifier
- name: product name
- barcode/sku: product code
- category: product category
- cost_price: purchase cost
- selling_price: retail price
- stock_quantity: current stock
- min_stock_level: reorder threshold
- created_at: timestamp
- updated_at: timestamp
```

### 5.2 Transaction
```
- id: unique identifier
- transaction_number: unique receipt number
- date: timestamp
- items: list of transaction items
- subtotal: amount before tax
- tax: tax amount
- total: final amount
- payment_method: payment type
- cashier: user who processed
```

### 5.3 Transaction Item
```
- id: unique identifier
- transaction_id: reference to transaction
- product_id: reference to product
- product_name: (snapshot)
- quantity: items sold
- unit_price: price per item
- line_total: quantity × unit_price
```

### 5.4 Category
```
- id: unique identifier
- name: category name
- description: optional description
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Fast product search (< 1 second)
- Quick checkout process (< 30 seconds per transaction)
- Support up to 10,000 products

### 6.2 Reliability
- Data persistence (no data loss on crash)
- Automatic backups

### 6.3 Usability
- Minimal training required (< 30 minutes)
- Intuitive interface
- Mobile-friendly (optional)

### 6.4 Security
- User authentication (login/logout)
- Transaction history cannot be deleted
- Secure payment data handling

---

## 7. Future Enhancements (Phase 3+)

Advanced features for future consideration:

- Customer management (loyalty program, customer profiles)
- Employee management (multiple cashiers, roles, permissions)
- Barcode label printing
- Email/SMS receipts
- Multi-store support with centralized reporting
- Advanced analytics and forecasting
- Integration with accounting software

---

## 8. Success Metrics

- Reduced checkout time by 50%
- 100% accurate inventory tracking
- Zero revenue discrepancies
- User satisfaction score > 4/5
- Training time < 30 minutes

---

## 9. Technology Stack

### 9.1 Frontend
- **Framework**: React.js or Next.js (recommended for SEO and performance)
- **UI Library**: Tailwind CSS for styling
- **State Management**: React Context or Zustand
- **Form Handling**: React Hook Form

### 9.2 Backend & Database
- **Backend**: Supabase
  - PostgreSQL database
  - Built-in authentication (user login/logout)
  - Real-time subscriptions (live stock updates)
  - Row Level Security (RLS) for data protection
  - RESTful API and GraphQL support
- **Database Tables**:
  - `products`
  - `categories`
  - `transactions`
  - `transaction_items`
  - `inventory_history`
  - `users` (managed by Supabase Auth)

### 9.3 Hosting & Deployment
- **Hosting**: Netlify
  - Continuous deployment from Git
  - Automatic HTTPS
  - Fast global CDN
  - Serverless functions for backend logic (if needed)
  - Preview deployments for testing
- **Environment Variables**:
  - Supabase URL and anon key
  - Supabase service role key (server-side only)

### 9.4 Development Tools
- **Version Control**: Git
- **Package Manager**: npm or pnpm
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript (recommended)

### 9.5 Additional Features via Supabase
- **Real-time Updates**: Live inventory updates across multiple devices
- **Authentication**: Email/password or OAuth (Google, GitHub)
- **Storage**: Product images storage
- **Edge Functions**: Custom backend logic when needed
- **Automatic Backups**: Supabase handles database backups

### 9.6 Architecture Benefits
- **Scalable**: Easy to scale from single store to multiple locations
- **Secure**: Built-in security with RLS and authentication
- **Fast**: Global CDN via Netlify, edge-optimized database
- **Cost-effective**: Generous free tiers for both platforms
- **Developer-friendly**: Great DX with TypeScript support

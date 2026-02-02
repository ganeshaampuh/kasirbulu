# Kasir Bulu - Pet Shop POS System

A simple, easy-to-use Point of Sale (POS) system designed specifically for pet shop retail operations.

## MVP Features

- **Checkout**: Add products by search, cart management, cash payment
- **Product Management**: Add/edit/delete products with basic info
- **Transaction History**: View completed transactions and details
- **Basic Dashboard**: Today's sales, transaction count, low stock alerts
- **Authentication**: Simple email/password login

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand (for cart)
- **Hosting**: Netlify (ready to deploy)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

Follow the instructions in `supabase/README.md` to:

1. Create a new Supabase project
2. Run the SQL schema files (schema.sql, rls-policies.sql, sample-data.sql)
3. Get your project URL and anon key

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your Account

1. Click "Get Started" or go to `/login`
2. Click "Sign Up"
3. Enter your email and password
4. Check your email for the confirmation link from Supabase
5. After confirming, log in to access the dashboard

## Database Schema

### Tables

- **categories**: Product categories (Dog, Cat, Bird, Fish, Accessories)
- **products**: Product catalog with pricing and stock
- **transactions**: Sales transactions
- **transaction_items**: Line items for each transaction

### Features

- Auto-generated transaction numbers (TXNYYYYMMDD-####)
- Auto-updating timestamps
- Row Level Security (RLS) enabled
- Sample data included for testing

## Pages

- `/` - Landing page
- `/login` - Login/Signup
- `/dashboard` - Sales overview and quick actions
- `/checkout` - Point of sale interface
- `/products` - Product management
- `/transactions` - Transaction history

## Deployment to Netlify

### 1. Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Netlify

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy!

## Sample Data

The system includes 8 sample products across different categories:
- Dog Food, Dog Collar
- Cat Food, Cat Litter
- Bird Cage
- Fish Tank
- Pet Shampoo, Pet Toy

You can add, edit, or delete these products from the Products page.

## Future Enhancements (Post-MVP)

- Barcode scanning
- Multiple payment methods (QRIS, E-wallet, Bank transfer)
- Receipt printing
- Tax calculation and discounts
- Inventory management (stock in/out, history)
- Advanced reporting and analytics
- Multi-user support with roles
- Real-time updates across devices

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

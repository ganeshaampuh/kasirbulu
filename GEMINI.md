# Kasir Bulu - Pet Shop POS System (GEMINI.md)

This document provides a comprehensive overview of the "Kasir Bulu" project, a Point of Sale (POS) system tailored for pet shop retail operations, generated for use as instructional context for future Gemini CLI interactions.

## Project Overview

Kasir Bulu is a simple, easy-to-use Point of Sale (POS) system designed specifically for pet shop retail operations. It features checkout capabilities, product management, transaction history, a basic dashboard, and authentication.

**Key Features (MVP):**
-   **Checkout**: Add products by search, cart management, cash payment.
-   **Product Management**: Add/edit/delete products with basic information.
-   **Transaction History**: View completed transactions and their details.
-   **Basic Dashboard**: Displays today's sales, transaction count, and low stock alerts.
-   **Authentication**: Simple email/password login system.

**Tech Stack:**
-   **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS.
-   **Backend/Database**: Supabase (PostgreSQL, Auth, Real-time).
-   **State Management**: Zustand (for cart).
-   **Hosting**: Netlify.

## Building and Running

### Prerequisites

-   Node.js 18+ installed.
-   A Supabase account (free tier is sufficient).

### Setup Instructions

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Set Up Supabase:**
    Follow the instructions in `supabase/README.md` to:
    -   Create a new Supabase project.
    -   Run the SQL schema files (`schema.sql`, `rls-policies.sql`, `sample-data.sql`).
    -   Obtain your Supabase project URL and anon key.

3.  **Configure Environment Variables:**
    Copy the example environment file and update it with your Supabase credentials:

    ```bash
    cp .env.local.example .env.local
    ```

    Edit `.env.local` to include:

    ```
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```

4.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    The application will be accessible at [http://localhost:3000](http://localhost:3000).

5.  **Create Your Account:**
    -   Navigate to `/login` and click "Sign Up."
    -   Enter your email and password.
    -   Confirm your email via the link sent by Supabase.
    -   Log in to access the dashboard.

### Deployment

The project is configured for deployment to Netlify:

1.  **Push to Git:**
    Ensure your project is version-controlled and pushed to a Git repository.

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2.  **Connect to Netlify:**
    -   Go to [Netlify](https://netlify.com).
    -   Select "Add new site" → "Import an existing project."
    -   Connect your Git repository.
    -   Configure build settings:
        -   Build command: `npm run build`
        -   Publish directory: `.next`
    -   Add your Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Netlify.
    -   Deploy the site.

## Development Conventions

### Technologies Used

-   **Frontend Framework**: Next.js (React)
-   **Styling**: Tailwind CSS
-   **Language**: TypeScript
-   **Database/Auth**: Supabase (PostgreSQL)
-   **State Management**: Zustand

### Database Schema

The database is managed via Supabase and includes the following tables:

-   **categories**: Stores product categories (e.g., Dog, Cat, Bird, Fish, Accessories).
-   **products**: Contains product catalog information, including pricing and stock.
-   **transactions**: Records sales transactions.
-   **transaction_items**: Stores line items for each transaction.

**Key Database Features:**
-   Auto-generated transaction numbers (e.g., `TXNYYYYMMDD-####`).
-   Auto-updating timestamps.
-   Row Level Security (RLS) is enabled for data protection.
-   Sample data is provided for testing purposes.

### Project Structure Highlights

-   `app/`: Next.js app directory for pages and global styles.
-   `components/`: Reusable React components (e.g., `Navbar.tsx`, `Receipt.tsx`).
-   `lib/`: Utility functions and client configurations (e.g., `auth.tsx`, `cart.tsx`, `supabase.ts`).
-   `supabase/`: Supabase related files, including SQL schemas and migrations.

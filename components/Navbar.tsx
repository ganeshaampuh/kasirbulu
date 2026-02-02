'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-xl font-bold">
              Kasir Bulu
            </Link>
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <Link href="/checkout" className="hover:text-blue-200">
                  Checkout
                </Link>
                <Link href="/products" className="hover:text-blue-200">
                  Products
                </Link>
                <Link href="/transactions" className="hover:text-blue-200">
                  Transactions
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

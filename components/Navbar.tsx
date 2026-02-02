'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold hover:text-blue-200 transition-colors">
              Kasir Bulu
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Dasbor
              </Link>
              <Link
                href="/checkout"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Kasir
              </Link>
              <Link
                href="/products"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Produk
              </Link>
              <Link
                href="/transactions"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Transaksi
              </Link>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Email - Desktop Only */}
                <span className="hidden sm:block text-sm text-blue-100">{user.email}</span>

                {/* Logout Button - Desktop */}
                <button
                  onClick={signOut}
                  className="hidden sm:block bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Keluar
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500 pb-4">
            <div className="pt-2 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Dasbor
              </Link>
              <Link
                href="/checkout"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Kasir
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Produk
              </Link>
              <Link
                href="/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Transaksi
              </Link>
              <div className="border-t border-blue-500 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-blue-100">{user.email}</div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

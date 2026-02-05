'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
                    setError('')
                    setLoading(true)
            
                    const { error } = isSignUp
                      ? await signUp(email, password)
                      : await signIn(email, password)
            
                    if (error) {
                      setError(error.message)
                      setLoading(false)
                    } else {
                      if (isSignUp) {
                        setError('Cek email Anda untuk tautan konfirmasi!')
                      } else {
                        router.push('/dashboard')
                      }
                      setLoading(false)
                    }  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Daftar' : 'Masuk'}
        </h1>

        {error && (
          <div className={`p-3 rounded mb-4 text-sm ${error.includes('Cek email')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'Memuat...' : isSignUp ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? 'Masuk' : 'Daftar'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-700">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

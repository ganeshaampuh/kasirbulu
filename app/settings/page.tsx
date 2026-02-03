'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const savedSettings = localStorage.getItem('kasir_bulu_settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      if (parsed.lowStockThreshold) {
        setLowStockThreshold(parsed.lowStockThreshold)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save to localStorage
    const settings = {
      lowStockThreshold: Number(lowStockThreshold)
    }
    localStorage.setItem('kasir_bulu_settings', JSON.stringify(settings))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pengaturan</h1>

        <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Pengaturan Stok
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Konfigurasi peringatan stok menipis.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                  Batas Stok Menipis
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="threshold"
                    id="threshold"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Produk dengan jumlah stok di bawah angka ini akan ditandai sebagai "Stok Menipis" di dasbor.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              {saved && (
                <span className="text-green-600 text-sm mr-4 animate-fade-in-out">
                  Pengaturan berhasil disimpan!
                </span>
              )}
              <button
                type="submit"
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

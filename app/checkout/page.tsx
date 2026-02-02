'use client'

import { useState, useEffect } from 'react'
import { supabase, type Product, type TransactionWithItems } from '@/lib/supabase'
import { useCart } from '@/lib/cart'
import dynamic from 'next/dynamic'
import '../receipt/print.css'

const Receipt = dynamic(() => import('@/components/Receipt'), { ssr: false })

export default function CheckoutPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<(TransactionWithItems & { payment_received?: number; change?: number }) | null>(null)
  const [cashReceived, setCashReceived] = useState('')
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCart()

  const total = getTotal()
  const cashReceivedNum = parseFloat(cashReceived) || 0
  const change = cashReceivedNum - total
  const canCompleteSale = cashReceivedNum >= total && items.length > 0

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .gte('stock_quantity', 1)
      .order('name')

    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleCompleteSale = async () => {
    if (items.length === 0 || cashReceivedNum < total) return

    setLoading(true)

    // Generate transaction number
    const transactionNumber = `TRX-${Date.now()}`

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          transaction_number: transactionNumber,
          total: getTotal(),
          payment_method: 'cash',
        },
      ])
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      setLoading(false)
      return
    }

    // Create transaction items and update stock
    const transactionItems = items.map((item) => ({
      transaction_id: transaction.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems)

    if (itemsError) {
      console.error('Error creating transaction items:', itemsError)
      setLoading(false)
      return
    }

    // Update stock quantities
    for (const item of items) {
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock_quantity: item.stock_quantity - item.quantity })
        .eq('id', item.id)

      if (stockError) {
        console.error('Error updating stock:', stockError)
      }
    }

    // Set last transaction with items for receipt
    setLastTransaction({
      ...transaction,
      transaction_items: transactionItems,
      payment_received: cashReceivedNum,
      change: change,
    })

    clearCart()
    setCompleted(true)
    setLoading(false)
    setCashReceived('')
  }

  if (completed && lastTransaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Penjualan Selesai!</h1>
            <p className="text-gray-500">Transaksi berhasil dicatat</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">No. Transaksi</span>
              <span className="font-medium text-gray-900">
                {lastTransaction.transaction_number || `ID-${lastTransaction.id.slice(0, 8)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Belanja</span>
              <span className="font-bold text-gray-900">Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uang Diterima</span>
              <span className="font-medium text-gray-900">Rp {lastTransaction.payment_received?.toLocaleString('id-ID') || '0'}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
              <span className="text-gray-600 font-semibold">Uang Kembali</span>
              <span className="font-bold text-blue-600">Rp {lastTransaction.change?.toLocaleString('id-ID') || '0'}</span>
            </div>
          </div>

          <Receipt
            transaction={lastTransaction}
            onClose={() => {
              setCompleted(false)
              setLastTransaction(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Kasir</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Search */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Memuat produk...</div>
              ) : (
                filteredProducts.map((product) => {
                  const inCart = items.find((i) => i.id === product.id)
                  return (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.sku} • Stok: {product.stock_quantity}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            stock_quantity: product.stock_quantity,
                          })
                        }
                        disabled={(inCart?.quantity ?? 0) >= product.stock_quantity}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {inCart ? `Tambah (${inCart.quantity}/${product.stock_quantity})` : 'Tambah'}
                      </button>
                    </div>
                  )
                })
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">Tidak ada produk ditemukan</div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Keranjang</h2>
              <button
                onClick={() => {
                  clearCart()
                  setCashReceived('')
                }}
                disabled={items.length === 0}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400"
              >
                Kosongkan Keranjang
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🛒</div>
                <div>Keranjang kosong</div>
                <div className="text-sm mt-2">Tambahkan produk untuk menyelesaikan penjualan</div>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Rp {item.price.toLocaleString('id-ID')} / item
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Uang Diterima
                      </label>
                      <input
                        type="number"
                        placeholder="Masukkan jumlah uang"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                        min="0"
                        step="1000"
                      />
                    </div>

                    {/* Change Display */}
                    {cashReceived && (
                      <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                        <span className="text-sm text-gray-600">Kembalian:</span>
                        <span className={`text-lg font-bold ${change >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {change >= 0 ? 'Rp ' + change.toLocaleString('id-ID') : 'Kurang Rp ' + Math.abs(change).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCompleteSale}
                    disabled={!canCompleteSale || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? 'Memproses...' : 'Selesaikan Penjualan'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

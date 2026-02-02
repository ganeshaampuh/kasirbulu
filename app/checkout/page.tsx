'use client'

import { useState, useEffect } from 'react'
import { supabase, type Product } from '@/lib/auth'
import { useCart } from '@/lib/cart'

export default function CheckoutPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCart()

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
    if (items.length === 0) return

    setLoading(true)

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
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

    clearCart()
    setCompleted(true)
    setLoading(false)

    setTimeout(() => setCompleted(false), 3000)
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Sale Completed!</h1>
          <p className="text-gray-600">Transaction recorded successfully</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Products</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading products...</div>
            ) : (
              filteredProducts.map((product) => {
                const inCart = items.find((i) => i.id === product.id)
                return (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.sku} • Stock: {product.stock_quantity}
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
                      disabled={inCart?.quantity >= product.stock_quantity}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                    >
                      {inCart ? `Add (${inCart.quantity}/${product.stock_quantity})` : 'Add'}
                    </button>
                  </div>
                )
              })
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">No products found</div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cart</h2>
            <button
              onClick={clearCart}
              disabled={items.length === 0}
              className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400"
            >
              Clear Cart
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🛒</div>
              <div>Cart is empty</div>
              <div className="text-sm mt-2">Add products to complete a sale</div>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Rp {item.price.toLocaleString('id-ID')} each
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>Rp {getTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">Rp {getTotal().toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={handleCompleteSale}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 mt-4"
                >
                  {loading ? 'Processing...' : 'Complete Sale (Cash)'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

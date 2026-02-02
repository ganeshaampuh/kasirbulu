'use client'

import { useState, useEffect } from 'react'
import { supabase, type TransactionWithItems } from '@/lib/auth'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithItems | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
    } else {
      setTransactions(data as TransactionWithItems[])
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading transactions...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {transaction.transaction_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(transaction.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {transaction.transaction_items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    Rp {transaction.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No transactions yet. Complete your first sale!
            </div>
          )}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Transaction Details</h2>
                  <p className="text-gray-500">{selectedTransaction.transaction_number}</p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">
                    {new Date(selectedTransaction.created_at).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium capitalize">{selectedTransaction.payment_method}</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedTransaction.transaction_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x Item ID: {item.product_id.slice(0, 8)}...
                        </span>
                        <span>Rp {item.line_total.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      Rp {selectedTransaction.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

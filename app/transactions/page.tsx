'use client'

import { useState, useEffect } from 'react'
import { supabase, type TransactionWithItems } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import '../receipt/print.css'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './datepicker.css'

const Receipt = dynamic(() => import('@/components/Receipt'), { ssr: false })

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithItems[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<(TransactionWithItems & { transaction_items: any[] }) | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction || !window.confirm('Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.')) {
      return
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', selectedTransaction.id)

    if (error) {
      alert('Gagal menghapus transaksi: ' + error.message)
    } else {
      alert('Transaksi berhasil dihapus')
      setSelectedTransaction(null)
      fetchTransactions()
    }
  }

  useEffect(() => {
    filterTransactions()
  }, [transactions, startDate, endDate])

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

  const filterTransactions = () => {
    let filtered = [...transactions]

    if (startDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.created_at)
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        return transactionDate >= start
      })
    }

    if (endDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.created_at)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return transactionDate <= end
      })
    }

    setFilteredTransactions(filtered)
  }

  const clearFilters = () => {
    setStartDate(null)
    setEndDate(null)
  }

  const handleViewTransaction = async (transaction: TransactionWithItems) => {
    // Fetch product names for items that don't have them
    const itemsWithNames = await Promise.all(
      transaction.transaction_items.map(async (item) => {
        if (item.product_name) return item

        const { data } = await supabase
          .from('products')
          .select('name')
          .eq('id', item.product_id)
          .single()

        return {
          ...item,
          product_name: data?.name || `Item ${item.product_id.slice(0, 8)}`,
        }
      })
    )

    setSelectedTransaction({
      ...transaction,
      transaction_items: itemsWithNames,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Riwayat Transaksi</h1>

          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full sm:max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Dari Tanggal
              </label>
              <ReactDatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal mulai"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                isClearable
              />
            </div>

            <div className="flex-1 w-full sm:max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sampai Tanggal
              </label>
              <ReactDatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal akhir"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                isClearable
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {(startDate || endDate) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm whitespace-nowrap"
                >
                  Hapus Filter
                </button>
              )}
              <div className="flex-1 sm:flex-none text-sm text-gray-500 py-2">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaksi' : 'transaksi'}
                {(startDate || endDate) && ` difilter`}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Memuat transaksi...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada transaksi</h3>
            <p className="text-gray-500 text-sm text-center">
              {startDate || endDate ? 'Coba atur ulang filter tanggal' : 'Selesaikan penjualan pertama Anda!'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {transaction.transaction_number}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(transaction.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      Rp {transaction.total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {transaction.payment_method === 'cash' ? 'Tunai' : transaction.payment_method}
                    </span>
                    <span className="text-sm text-gray-500">
                      {transaction.transaction_items?.length || 0} item
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewTransaction(transaction)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Lihat Detail →
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No. Transaksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal & Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {transaction.transaction_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(transaction.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {transaction.transaction_items?.length || 0} item
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {transaction.payment_method === 'cash' ? 'Tunai' : transaction.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 text-sm">
                      Rp {transaction.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTransaction(null)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{selectedTransaction.transaction_number}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedTransaction.created_at).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Metode Pembayaran</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {selectedTransaction.payment_method === 'cash' ? 'Tunai' : selectedTransaction.payment_method}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Item</h3>
                    <div className="space-y-2">
                      {selectedTransaction.transaction_items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm py-2">
                          <span className="text-gray-600">
                            {item.quantity}x ID Item: {item.product_id.slice(0, 8)}...
                          </span>
                          <span className="font-medium text-gray-900">
                            Rp {item.line_total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">
                        Rp {selectedTransaction.total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Print and Delete Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  onClick={handleDeleteTransaction}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Hapus Transaksi
                </button>
                <Receipt
                  transaction={selectedTransaction}
                  onClose={() => setSelectedTransaction(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

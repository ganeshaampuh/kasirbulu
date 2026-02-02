import { type TransactionWithItems } from '@/lib/supabase'

interface ReceiptProps {
  transaction: TransactionWithItems & { transaction_items: any[]; payment_received?: number; change?: number }
  onClose?: () => void
}

export default function Receipt({ transaction, onClose }: ReceiptProps) {
  const handlePrint = () => {
    window.print()
    onClose?.()
  }

  return (
    <>
      <div className="print-only">
        <div id="receipt" className="w-[58mm] mx-auto bg-white p-2 text-xs">
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="font-bold text-sm mb-1">KASIR BULU</h1>
            <p className="text-[10px]">Pet Shop POS</p>
          </div>

          <div className="border-b border-dashed border-gray-300 mb-2"></div>

          {/* Transaction Info */}
          <div className="mb-2">
            <div className="flex justify-between">
              <span>No:</span>
              <span>{transaction.transaction_number || `ID-${transaction.id.slice(0, 8)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>
                {new Date(transaction.created_at).toLocaleString('id-ID', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Metode:</span>
              <span className="capitalize">
                {transaction.payment_method === 'cash' ? 'Tunai' : transaction.payment_method}
              </span>
            </div>
          </div>

          <div className="border-b border-dashed border-gray-300 mb-2"></div>

          {/* Items */}
          <div className="mb-2">
            {transaction.transaction_items?.map((item, index) => (
              <div key={index} className="mb-1">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {item.product_name || `Item ${index + 1}`}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>{item.quantity} x Rp {item.unit_price.toLocaleString('id-ID')}</span>
                  <span>Rp {item.line_total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed border-gray-300 mb-2"></div>

          {/* Total */}
          <div className="flex justify-between font-bold text-sm mb-1">
            <span>TOTAL</span>
            <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
          </div>

          {transaction.payment_received !== undefined && transaction.payment_received > 0 && (
            <>
              <div className="flex justify-between text-xs mb-1">
                <span>Tunai</span>
                <span>Rp {transaction.payment_received.toLocaleString('id-ID')}</span>
              </div>
              {transaction.change !== undefined && transaction.change >= 0 && (
                <div className="flex justify-between text-xs font-semibold">
                  <span>Kembali</span>
                  <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
                </div>
              )}
            </>
          )}

          <div className="border-b border-dashed border-gray-300 mb-2"></div>

          {/* Footer */}
          <div className="text-center text-[10px] text-gray-600 mb-2">
            <p>Terima Kasih</p>
            <p>Barang yang dibeli</p>
            <p>tidak dapat ditukar</p>
          </div>
        </div>
      </div>

      {/* Screen Only - Print Button */}
      <div className="screen-only flex gap-2">
        <button
          onClick={handlePrint}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Struk
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
          >
            Tutup
          </button>
        )}
      </div>
    </>
  )
}

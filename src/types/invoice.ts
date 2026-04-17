// EP-06 – Payment & Invoicing Types

export type InvoiceType = 'full' | 'deposit' | 'balance'

export type InvoicePaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled'

export type InvoicePaymentMethod =
  | 'vnpay'
  | 'momo'
  | 'zalopay'
  | 'cash'
  | 'bank_transfer'
  | 'credit'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Invoice {
  id: string
  invoiceCode: string

  // Customer
  customerId: string
  customerName: string

  // Source
  source: 'booking' | 'contract' | 'credit_topup'
  sourceId: string
  sourceCode: string   // booking/contract code, or credit account code (CA-CUS-xxxx)

  // Type
  invoiceType: InvoiceType
  depositPercent?: number
  relatedInvoiceId?: string

  // Dates
  invoiceDate: string   // ISO date
  dueDate: string

  // Items & amounts
  items: InvoiceItem[]
  subtotal: number
  discountAmount: number
  taxPercent: number
  taxAmount: number
  totalAmount: number

  // Payment
  paymentStatus: InvoicePaymentStatus
  paidAmount: number
  paidAt?: string
  paymentMethod?: InvoicePaymentMethod
  paymentTransactionId?: string

  // Meta
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}
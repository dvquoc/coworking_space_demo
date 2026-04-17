import { api } from './api'
import type { Invoice, InvoicePaymentMethod } from '../types/invoice'

export interface RecordPaymentRequest {
  invoiceId: string
  amount: number
  paymentMethod: InvoicePaymentMethod
  notes?: string
}

export interface InvoiceFilters {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

export const invoiceService = {
  getAll: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>('/invoices', { params: filters })
    return response.data
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`)
    return response.data
  },

  recordPayment: async (data: RecordPaymentRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoices/${data.invoiceId}/payments`, data)
    return response.data
  },
}

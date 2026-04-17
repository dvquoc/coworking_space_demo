import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoiceService } from '../services/invoiceService'
import type { RecordPaymentRequest } from '../services/invoiceService'
import * as invoiceMocks from '../mocks/invoiceMocks'

const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () =>
      MOCK_API
        ? invoiceMocks.getInvoices()
        : invoiceService.getAll(),
  })
}

export function useInvoiceById(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () =>
      MOCK_API
        ? invoiceMocks.getInvoiceById(id)
        : invoiceService.getById(id),
    enabled: !!id,
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordPaymentRequest) =>
      MOCK_API
        ? Promise.resolve(
            invoiceMocks.recordPayment(
              data.invoiceId,
              data.amount,
              data.paymentMethod,
              data.notes,
            ),
          )
        : invoiceService.recordPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

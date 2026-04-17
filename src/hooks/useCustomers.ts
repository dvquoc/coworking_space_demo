import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService, customerTabsService, employeeService, tagService } from '../services/customerService'
import { mockCustomerAPI } from '../mocks/customerMocks'
import type {
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '../types/customer'

// Mock mode flag
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// ========== CUSTOMER HOOKS ==========

export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getCustomers(filters) 
      : customerService.getAll(filters),
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getCustomer(id) 
      : customerService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => MOCK_API 
      ? mockCustomerAPI.createCustomer(data) 
      : customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateCustomerRequest) => MOCK_API 
      ? mockCustomerAPI.updateCustomer(data) 
      : customerService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] })
    },
  })
}

export function useSuspendCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => MOCK_API 
      ? mockCustomerAPI.suspendCustomer(id, reason) 
      : customerService.suspend(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] })
    },
  })
}

export function useReactivateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => MOCK_API 
      ? mockCustomerAPI.reactivateCustomer(id) 
      : customerService.reactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customers', id] })
    },
  })
}

// ========== CUSTOMER TABS HOOKS ==========

export function useCustomerBookings(customerId: string, filter?: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'bookings', filter],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getCustomerBookings(customerId) 
      : customerTabsService.getBookings(customerId, filter),
    enabled: !!customerId,
  })
}

export function useCustomerContracts(customerId: string, filter?: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'contracts', filter],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getCustomerContracts(customerId) 
      : customerTabsService.getContracts(customerId, filter),
    enabled: !!customerId,
  })
}

export function useCustomerInvoices(customerId: string, filter?: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'invoices', filter],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getCustomerInvoices(customerId) 
      : customerTabsService.getInvoices(customerId, filter),
    enabled: !!customerId,
  })
}

// ========== EMPLOYEE HOOKS ==========

export function useEmployees(customerId: string) {
  return useQuery({
    queryKey: ['customers', customerId, 'employees'],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getEmployees(customerId) 
      : employeeService.getAll(customerId),
    enabled: !!customerId,
  })
}

export function useCreateEmployee(customerId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => MOCK_API 
      ? mockCustomerAPI.createEmployee(customerId, data) 
      : employeeService.create(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'employees'] })
    },
  })
}

export function useUpdateEmployee(customerId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateEmployeeRequest) => 
      employeeService.update(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'employees'] })
    },
  })
}

export function useDeactivateEmployee(customerId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ employeeId, options }: { 
      employeeId: string; 
      options: { cancelUpcomingBookings?: boolean; reason?: string } 
    }) => employeeService.deactivate(customerId, employeeId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'employees'] })
    },
  })
}

export function useReactivateEmployee(customerId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (employeeId: string) => 
      employeeService.reactivate(customerId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'employees'] })
    },
  })
}

// ========== TAGS HOOKS ==========

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => MOCK_API 
      ? mockCustomerAPI.getTags() 
      : tagService.getAll(),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { name: string; displayName: string; color: string; description?: string }) => 
      tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<{ name: string; displayName: string; color: string; description?: string }>) => 
      tagService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useBulkUpdateTags() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ customerIds, addTags, removeTags }: { 
      customerIds: string[]; 
      addTags: string[]; 
      removeTags: string[] 
    }) => tagService.bulkUpdate(customerIds, addTags, removeTags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

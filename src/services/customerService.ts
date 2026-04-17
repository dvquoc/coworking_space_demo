import { api } from './api'
import type {
  CustomerFilters,
  PaginatedCustomers,
  CustomerDetails,
  CustomerBooking,
  CustomerContract,
  CustomerInvoice,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  EmployeesResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Tag,
  CompanyEmployee,
} from '../types/customer'

// ========== CUSTOMER SERVICE ==========

export const customerService = {
  // Get paginated customers
  getAll: async (filters?: CustomerFilters): Promise<PaginatedCustomers> => {
    const response = await api.get<PaginatedCustomers>('/customers', { params: filters })
    return response.data
  },

  // Get customer by ID
  getById: async (id: string): Promise<CustomerDetails> => {
    const response = await api.get<CustomerDetails>(`/customers/${id}`)
    return response.data
  },

  // Create customer
  create: async (data: CreateCustomerRequest): Promise<CustomerDetails> => {
    const response = await api.post<CustomerDetails>('/customers', data)
    return response.data
  },

  // Update customer
  update: async ({ id, ...data }: UpdateCustomerRequest): Promise<CustomerDetails> => {
    const response = await api.put<CustomerDetails>(`/customers/${id}`, data)
    return response.data
  },

  // Delete customer
  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`)
  },

  // Suspend customer
  suspend: async (id: string, reason: string): Promise<CustomerDetails> => {
    const response = await api.patch<CustomerDetails>(`/customers/${id}/suspend`, { reason })
    return response.data
  },

  // Reactivate customer
  reactivate: async (id: string): Promise<CustomerDetails> => {
    const response = await api.patch<CustomerDetails>(`/customers/${id}/reactivate`)
    return response.data
  },

  // Update customer notes
  updateNotes: async (id: string, notes: string): Promise<{ notes: string; updatedAt: string }> => {
    const response = await api.patch<{ notes: string; updatedAt: string }>(`/customers/${id}/notes`, { notes })
    return response.data
  },

  // Update customer tags
  updateTags: async (id: string, tagIds: string[]): Promise<CustomerDetails> => {
    const response = await api.put<CustomerDetails>(`/customers/${id}/tags`, { tagIds })
    return response.data
  },

  // Check email availability
  checkEmail: async (email: string, excludeId?: string): Promise<{ available: boolean }> => {
    const response = await api.get<{ available: boolean }>('/customers/check-email', { 
      params: { email, excludeId } 
    })
    return response.data
  },

  // Check tax code availability (for companies)
  checkTaxCode: async (taxCode: string, excludeId?: string): Promise<{ available: boolean }> => {
    const response = await api.get<{ available: boolean }>('/customers/check-tax-code', { 
      params: { taxCode, excludeId } 
    })
    return response.data
  },
}

// ========== CUSTOMER TABS SERVICE ==========

export const customerTabsService = {
  // Get customer bookings
  getBookings: async (customerId: string, filter?: string): Promise<CustomerBooking[]> => {
    const response = await api.get<CustomerBooking[]>(`/customers/${customerId}/bookings`, { 
      params: { filter } 
    })
    return response.data
  },

  // Get customer contracts
  getContracts: async (customerId: string, filter?: string): Promise<CustomerContract[]> => {
    const response = await api.get<CustomerContract[]>(`/customers/${customerId}/contracts`, { 
      params: { filter } 
    })
    return response.data
  },

  // Get customer invoices
  getInvoices: async (customerId: string, filter?: string): Promise<CustomerInvoice[]> => {
    const response = await api.get<CustomerInvoice[]>(`/customers/${customerId}/invoices`, { 
      params: { filter } 
    })
    return response.data
  },
}

// ========== EMPLOYEE SERVICE ==========

export const employeeService = {
  // Get employees for a company customer
  getAll: async (customerId: string): Promise<EmployeesResponse> => {
    const response = await api.get<EmployeesResponse>(`/customers/${customerId}/employees`)
    return response.data
  },

  // Get employee by ID
  getById: async (customerId: string, employeeId: string): Promise<CompanyEmployee> => {
    const response = await api.get<CompanyEmployee>(`/customers/${customerId}/employees/${employeeId}`)
    return response.data
  },

  // Create employee
  create: async (customerId: string, data: CreateEmployeeRequest): Promise<CompanyEmployee> => {
    const response = await api.post<CompanyEmployee>(`/customers/${customerId}/employees`, data)
    return response.data
  },

  // Update employee
  update: async (customerId: string, { id, ...data }: UpdateEmployeeRequest): Promise<CompanyEmployee> => {
    const response = await api.put<CompanyEmployee>(`/customers/${customerId}/employees/${id}`, data)
    return response.data
  },

  // Deactivate employee
  deactivate: async (
    customerId: string, 
    employeeId: string, 
    options: { cancelUpcomingBookings?: boolean; reason?: string }
  ): Promise<CompanyEmployee> => {
    const response = await api.patch<CompanyEmployee>(
      `/customers/${customerId}/employees/${employeeId}/deactivate`, 
      options
    )
    return response.data
  },

  // Reactivate employee
  reactivate: async (customerId: string, employeeId: string): Promise<CompanyEmployee> => {
    const response = await api.patch<CompanyEmployee>(`/customers/${customerId}/employees/${employeeId}/reactivate`)
    return response.data
  },

  // Delete employee
  delete: async (customerId: string, employeeId: string): Promise<void> => {
    await api.delete(`/customers/${customerId}/employees/${employeeId}`)
  },
}

// ========== TAGS SERVICE ==========

export const tagService = {
  // Get all tags
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get<Tag[]>('/tags')
    return response.data
  },

  // Create custom tag
  create: async (data: { name: string; displayName: string; color: string; description?: string }): Promise<Tag> => {
    const response = await api.post<Tag>('/tags', data)
    return response.data
  },

  // Update tag (only color for system tags, all fields for custom tags)
  update: async (id: string, data: Partial<Tag>): Promise<Tag> => {
    const response = await api.put<Tag>(`/tags/${id}`, data)
    return response.data
  },

  // Delete custom tag
  delete: async (id: string): Promise<{ deleted: boolean; customersAffected: number }> => {
    const response = await api.delete<{ deleted: boolean; customersAffected: number }>(`/tags/${id}`)
    return response.data
  },

  // Bulk tag update for customers
  bulkUpdate: async (
    customerIds: string[], 
    addTags: string[], 
    removeTags: string[]
  ): Promise<{ updated: number }> => {
    const response = await api.post<{ updated: number }>('/customers/bulk/tags', {
      customerIds,
      addTags,
      removeTags,
    })
    return response.data
  },
}

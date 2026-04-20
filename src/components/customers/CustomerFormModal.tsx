import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, User, Building2, UserCheck } from 'lucide-react'
import { useCreateCustomer, useUpdateCustomer, useCustomer } from '../../hooks/useCustomers'
import { TagSelect } from './TagChip'
import { mockCompanies } from '../../mocks/customerMocks'
import type { CustomerType, CompanySize, CreateCustomerRequest } from '../../types/customer'

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  customerId?: string  // If provided, we're editing
}

export function CustomerFormModal({ isOpen, onClose, customerId }: CustomerFormModalProps) {
  const { t } = useTranslation('customers')
  const isEditing = !!customerId
  
  // Fetch customer data if editing
  const { data: existingCustomer } = useCustomer(customerId || '')
  
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  
  // Form state
  const [customerType, setCustomerType] = useState<CustomerType>('individual')
  const [formData, setFormData] = useState<Partial<CreateCustomerRequest>>({
    email: '',
    phone: '',
    tags: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && existingCustomer) {
        setCustomerType(existingCustomer.customerType)
        setFormData({
          firstName: existingCustomer.firstName,
          lastName: existingCustomer.lastName,
          dateOfBirth: existingCustomer.dateOfBirth,
          nationalId: existingCustomer.nationalId,
          email: existingCustomer.email,
          phone: existingCustomer.phone,
          alternativePhone: existingCustomer.alternativePhone,
          address: existingCustomer.address,
          tags: existingCustomer.tags,
          notes: existingCustomer.notes,
          contactPersonName: existingCustomer.contactPersonName,
          contactPersonTitle: existingCustomer.contactPersonTitle,
          companyName: existingCustomer.company?.companyName,
          legalName: existingCustomer.company?.legalName,
          taxCode: existingCustomer.company?.taxCode,
          industry: existingCustomer.company?.industry,
          companySize: existingCustomer.company?.companySize,
          foundedYear: existingCustomer.company?.foundedYear,
          registeredAddress: existingCustomer.company?.registeredAddress,
          officeAddress: existingCustomer.company?.officeAddress,
          companyEmail: existingCustomer.company?.companyEmail,
          companyPhone: existingCustomer.company?.companyPhone,
          website: existingCustomer.company?.website,
          companyId: existingCustomer.companyId,
        })
      } else {
        setCustomerType('individual')
        setFormData({
          email: '',
          phone: '',
          tags: [],
        })
      }
      setErrors({})
    }
  }, [isOpen, isEditing, existingCustomer])
  
  const handleChange = (field: string, value: string | string[] | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Common validations
    if (!formData.email) {
      newErrors.email = t('err_email_required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('err_email_invalid')
    }
    
    if (!formData.phone) {
      newErrors.phone = t('err_phone_required')
    } else if (!/^0[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = t('err_phone_invalid')
    }
    
    if (customerType === 'individual' || customerType === 'company_member') {
      if (!formData.firstName) newErrors.firstName = t('err_first_name_required')
      if (!formData.lastName) newErrors.lastName = t('err_last_name_required')
      if (customerType === 'company_member' && !formData.companyId) {
        newErrors.companyId = t('err_company_required')
      }
    } else {
      if (!formData.companyName) newErrors.companyName = t('err_company_name_required')
      if (!formData.taxCode) newErrors.taxCode = t('err_tax_code_required')
      if (!formData.contactPersonName) newErrors.contactPersonName = t('err_contact_name_required')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    try {
      const data: CreateCustomerRequest = {
        ...formData as CreateCustomerRequest,
        customerType,
      }
      
      if (isEditing && customerId) {
        await updateMutation.mutateAsync({ id: customerId, ...data })
      } else {
        await createMutation.mutateAsync(data)
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save customer:', error)
    }
  }
  
  if (!isOpen) return null
  
  const isLoading = createMutation.isPending || updateMutation.isPending
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? t('form_title_edit') : t('form_title_add')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Customer Type Toggle (only for new customers) */}
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('form_type_label')}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerType('individual')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        customerType === 'individual'
                          ? 'border-[#b11e29] bg-[#b11e29]/5 text-[#b11e29]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">{t('type_individual')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerType('company')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        customerType === 'company'
                          ? 'border-[#b11e29] bg-[#b11e29]/5 text-[#b11e29]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">{t('type_company')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerType('company_member')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        customerType === 'company_member'
                          ? 'border-[#b11e29] bg-[#b11e29]/5 text-[#b11e29]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span className="font-medium text-sm">{t('type_company_member')}</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Individual / Company Member Fields */}
              {(customerType === 'individual' || customerType === 'company_member') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_first_name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                          errors.firstName ? 'border-rose-500' : 'border-slate-300'
                        }`}
                        placeholder="Nguyễn Văn"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_last_name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                          errors.lastName ? 'border-rose-500' : 'border-slate-300'
                        }`}
                        placeholder="An"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_date_of_birth')}
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_national_id')}
                      </label>
                      <input
                        type="text"
                        value={formData.nationalId || ''}
                        onChange={(e) => handleChange('nationalId', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                        placeholder="001234567890"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Company Selector (for company_member) */}
              {customerType === 'company_member' && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-medium text-purple-900 mb-3">{t('form_belongs_to_company')}</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('form_select_company')} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.companyId || ''}
                      onChange={(e) => handleChange('companyId', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                        errors.companyId ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">{t('form_select_company_placeholder')}</option>
                      {mockCompanies.filter(c => c.status === 'active').map(company => (
                        <option key={company.id} value={company.id}>
                          {company.companyName} ({company.companyCode})
                        </option>
                      ))}
                    </select>
                    {errors.companyId && (
                      <p className="mt-1 text-sm text-rose-500">{errors.companyId}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Company Fields */}
              {customerType === 'company' && (
                <>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-medium text-blue-900 mb-3">{t('form_company_info')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_company_name')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyName || ''}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                            errors.companyName ? 'border-rose-500' : 'border-slate-300'
                          }`}
                          placeholder="ABC Technology Co., Ltd"
                        />
                        {errors.companyName && (
                          <p className="mt-1 text-sm text-rose-500">{errors.companyName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_tax_code')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.taxCode || ''}
                          onChange={(e) => handleChange('taxCode', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                            errors.taxCode ? 'border-rose-500' : 'border-slate-300'
                          }`}
                          placeholder="0123456789"
                        />
                        {errors.taxCode && (
                          <p className="mt-1 text-sm text-rose-500">{errors.taxCode}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_industry')}
                        </label>
                        <input
                          type="text"
                          value={formData.industry || ''}
                          onChange={(e) => handleChange('industry', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                          placeholder="IT, Marketing, Finance..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_company_size')}
                        </label>
                        <select
                          value={formData.companySize || 'sme'}
                          onChange={(e) => handleChange('companySize', e.target.value as CompanySize)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                        >
                          <option value="startup">{t('form_size_startup')}</option>
                          <option value="sme">{t('form_size_sme')}</option>
                          <option value="enterprise">{t('form_size_enterprise')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_founded_year')}
                        </label>
                        <input
                          type="number"
                          value={formData.foundedYear || ''}
                          onChange={(e) => handleChange('foundedYear', parseInt(e.target.value) || undefined)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                          placeholder="2020"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_registered_address')}
                        </label>
                        <input
                          type="text"
                          value={formData.registeredAddress || ''}
                          onChange={(e) => handleChange('registeredAddress', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                          placeholder="123 Nguyễn Trãi, Quận 1, TP.HCM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {t('form_website')}
                        </label>
                        <input
                          type="url"
                          value={formData.website || ''}
                          onChange={(e) => handleChange('website', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_contact_name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPersonName || ''}
                        onChange={(e) => handleChange('contactPersonName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                          errors.contactPersonName ? 'border-rose-500' : 'border-slate-300'
                        }`}
                        placeholder="Nguyễn Văn An"
                      />
                      {errors.contactPersonName && (
                        <p className="mt-1 text-sm text-rose-500">{errors.contactPersonName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {t('form_contact_title')}
                      </label>
                      <input
                        type="text"
                        value={formData.contactPersonTitle || ''}
                        onChange={(e) => handleChange('contactPersonTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                        placeholder="Office Manager"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Common Contact Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form_email')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                      errors.email ? 'border-rose-500' : 'border-slate-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form_phone')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] ${
                      errors.phone ? 'border-rose-500' : 'border-slate-300'
                    }`}
                    placeholder="0901234567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-rose-500">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form_address')}
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29]"
                  placeholder="123 Nguyễn Trãi, Quận 1, TP.HCM"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('form_tags')}
                </label>
                <TagSelect
                  selectedTags={formData.tags || []}
                  onChange={(tags) => handleChange('tags', tags)}
                />
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form_notes')}
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] resize-none"
                  placeholder={t('form_notes_placeholder')}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {t('form_btn_cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isEditing ? t('form_btn_update') : t('form_btn_create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

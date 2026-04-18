import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Building2,
  User,
  Calendar,
  DollarSign,
  Wifi,
  Package,
  ConciergeBell,
  Bell,
  Plus,
  Minus,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBuildings, mockSpaces, mockPricingRules } from '../../mocks/propertyMocks'
import { mockCustomers } from '../../mocks/customerMocks'
import { mockAmenities, mockAssets, mockServices } from '../../mocks/contractMocks'
import {
  useContract,
  useContractTemplates,
  useCreateContract,
  useUpdateContract,
} from '../../hooks/useContracts'
import type {
  CreateContractRequest,
  RenewalPricing,
  ContractAsset,
} from '../../types/contract'

const STEPS = [
  { id: 1, icon: FileText },
  { id: 2, icon: DollarSign },
  { id: 3, icon: Check },
]

type FormData = {
  templateId: string
  customerId: string
  customerName: string
  buildingId: string
  buildingName: string
  spaceId: string
  spaceName: string
  startDate: string
  durationMonths: number
  monthlyFee: number
  depositAmount: number
  depositMonths: number
  setupFee: number
  selectedAmenities: string[]
  selectedAssets: ContractAsset[]
  selectedServices: string[]
  notifyCustomerDays: number
  notifyManagementDays: number
  renewalPreparationDays: number
  autoRenewalEnabled: boolean
  renewalDuration: number
  renewalPricing: RenewalPricing
  customMonthlyFee?: number
  customNotes: string
}

const initialFormData: FormData = {
  templateId: '',
  customerId: '',
  customerName: '',
  buildingId: '',
  buildingName: '',
  spaceId: '',
  spaceName: '',
  startDate: new Date().toISOString().slice(0, 10),
  durationMonths: 12,
  monthlyFee: 0,
  depositAmount: 0,
  depositMonths: 2,
  setupFee: 0,
  selectedAmenities: [],
  selectedAssets: [],
  selectedServices: [],
  notifyCustomerDays: 30,
  notifyManagementDays: 45,
  renewalPreparationDays: 60,
  autoRenewalEnabled: false,
  renewalDuration: 6,
  renewalPricing: 'same',
  customNotes: '',
}

export function ContractFormPage() {
  const { t } = useTranslation('contracts')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const { data: contract, isLoading: isLoadingContract } = useContract(id!)
  const { data: templates } = useContractTemplates({ isActive: true })
  const createMutation = useCreateContract()
  const updateMutation = useUpdateContract()

  useEffect(() => {
    if (contract && isEdit) {
      setFormData({
        templateId: contract.templateId,
        customerId: contract.customerId,
        customerName: contract.customerName,
        buildingId: contract.buildingId,
        buildingName: contract.buildingName,
        spaceId: contract.spaceId || '',
        spaceName: contract.spaceName || '',
        startDate: contract.startDate,
        durationMonths: contract.durationMonths,
        monthlyFee: contract.monthlyFee,
        depositAmount: contract.depositAmount,
        depositMonths: Math.round(contract.depositAmount / contract.monthlyFee) || 2,
        setupFee: contract.setupFee || 0,
        selectedAmenities: [],
        selectedAssets: [],
        selectedServices: [],
        notifyCustomerDays: contract.autoRenewalSettings?.notifyDaysBefore || 30,
        notifyManagementDays: 45,
        renewalPreparationDays: 60,
        autoRenewalEnabled: contract.autoRenewalSettings?.enabled || false,
        renewalDuration: contract.autoRenewalSettings?.renewalDuration || 6,
        renewalPricing: contract.autoRenewalSettings?.renewalPricing || 'same',
        customMonthlyFee: contract.autoRenewalSettings?.customMonthlyFee,
        customNotes: contract.customNotes || '',
      })
    }
  }, [contract, isEdit])

  useEffect(() => {
    if (formData.monthlyFee && formData.depositMonths) {
      setFormData((prev) => ({
        ...prev,
        depositAmount: prev.monthlyFee * prev.depositMonths,
      }))
    }
  }, [formData.monthlyFee, formData.depositMonths])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }))

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const toggleAmenity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(id)
        ? prev.selectedAmenities.filter((a) => a !== id)
        : [...prev.selectedAmenities, id],
    }))
  }

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }))
  }

  const toggleAsset = (id: string, name: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAssets.find((a) => a.id === id)
      if (exists) {
        return { ...prev, selectedAssets: prev.selectedAssets.filter((a) => a.id !== id) }
      }
      return { ...prev, selectedAssets: [...prev.selectedAssets, { id, name, quantity: 1 }] }
    })
  }

  const updateAssetQty = (id: string, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedAssets: prev.selectedAssets.map((a) =>
        a.id === id ? { ...a, quantity: Math.max(1, a.quantity + delta) } : a
      ),
    }))
  }

  const totalServiceFee = useMemo(() => {
    return mockServices
      .filter((s) => formData.selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.monthlyFee, 0)
  }, [formData.selectedServices])

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 1) {
      if (!formData.templateId) newErrors.templateId = t('err_select_template')
      if (!formData.customerId) newErrors.customerId = t('err_select_customer')
      if (!formData.buildingId) newErrors.buildingId = t('err_select_building')
      if (!formData.spaceId) newErrors.spaceId = t('err_select_space')
      if (!formData.startDate) newErrors.startDate = t('err_select_start_date')
    }

    if (step === 2) {
      if (!formData.monthlyFee || formData.monthlyFee <= 0) {
        newErrors.monthlyFee = t('err_monthly_fee_required')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return

    const requestData: CreateContractRequest = {
      templateId: formData.templateId,
      customerId: formData.customerId,
      buildingId: formData.buildingId,
      spaceId: formData.spaceId,
      startDate: formData.startDate,
      durationMonths: formData.durationMonths,
      monthlyFee: formData.monthlyFee,
      depositAmount: formData.depositAmount,
      setupFee: formData.setupFee || undefined,
      customNotes: formData.customNotes || undefined,
      selectedAmenities: formData.selectedAmenities.length > 0 ? formData.selectedAmenities : undefined,
      selectedAssets: formData.selectedAssets.length > 0 ? formData.selectedAssets : undefined,
      selectedServices: formData.selectedServices.length > 0 ? formData.selectedServices : undefined,
      notifyCustomerDays: formData.notifyCustomerDays,
      notifyManagementDays: formData.notifyManagementDays,
      renewalPreparationDays: formData.renewalPreparationDays,
      autoRenewalSettings: formData.autoRenewalEnabled
        ? {
            enabled: true,
            renewalDuration: formData.renewalDuration,
            renewalPricing: formData.renewalPricing,
            customMonthlyFee:
              formData.renewalPricing === 'custom'
                ? formData.customMonthlyFee
                : undefined,
          }
        : undefined,
    }

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...requestData })
        navigate('/contracts')
      } else {
        const result = await createMutation.mutateAsync(requestData)
        navigate(`/contracts/success?id=${result.id}&code=${encodeURIComponent(result.contractCode)}`)
      }
    } catch (error) {
      console.error('Failed to save contract:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isEdit && isLoadingContract) {
    return (
      <>
        <Header
          title={t('form_edit_title')}
          subtitle={t('loading')}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-slate-500">{t('loading')}</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header
        title={isEdit ? t('form_edit_title') : t('form_create_title')}
        subtitle={isEdit ? contract?.contractCode : undefined}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => navigate('/contracts')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('btn_back_list')}
        </button>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-full ${
                  currentStep === step.id
                    ? 'bg-sky-100 text-sky-700'
                    : currentStep > step.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                    currentStep === step.id
                      ? 'bg-sky-600 text-white'
                      : currentStep > step.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className="font-medium hidden sm:block">{[t('step1_label'), t('step2_label'), t('step3_label')][step.id - 1]}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-emerald-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('step1_label')}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('form_section_template')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="templateId"
                    value={formData.templateId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.templateId ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">{t('select_template')}</option>
                    {templates?.data.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} (v{template.version})
                      </option>
                    ))}
                  </select>
                  {errors.templateId && (
                    <p className="text-sm text-rose-500 mt-1">{errors.templateId}</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">{t('form_section_customer')}</span>
                    <span className="text-rose-500">*</span>
                  </div>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={(e) => {
                      const selected = e.target.value
                      const customer = mockCustomers.find((c) => c.id === selected)
                      setFormData((prev) => ({
                        ...prev,
                        customerId: selected,
                        customerName: customer?.fullName || '',
                      }))
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.customerId ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">{t('select_customer')}</option>
                    {mockCustomers
                      .filter((c) => c.status === 'active')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} ({c.customerCode})
                        </option>
                      ))}
                  </select>
                  {errors.customerId && (
                    <p className="text-sm text-rose-500 mt-1">{errors.customerId}</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">{t('form_section_location')}</span>
                    <span className="text-rose-500">*</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('select_building')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="buildingId"
                        value={formData.buildingId}
                        onChange={(e) => {
                          const selected = e.target.value
                          const building = mockBuildings.find((b) => b.id === selected)
                          setFormData((prev) => ({
                            ...prev,
                            buildingId: selected,
                            buildingName: building?.name || '',
                            spaceId: '',
                            spaceName: '',
                            monthlyFee: 0,
                          }))
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg ${
                          errors.buildingId ? 'border-rose-300' : 'border-slate-200'
                        }`}
                      >
                        <option value="">{t('select_building')}</option>
                        {mockBuildings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      {errors.buildingId && (
                        <p className="text-sm text-rose-500 mt-1">{errors.buildingId}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_space_select')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="spaceId"
                        value={formData.spaceId}
                        onChange={(e) => {
                          const selected = e.target.value
                          const space = mockSpaces.find((s) => s.id === selected)
                          const pricing = space
                            ? mockPricingRules.find((r) => r.spaceType === space.type)
                            : undefined
                          setFormData((prev) => ({
                            ...prev,
                            spaceId: selected,
                            spaceName: space?.name || '',
                            monthlyFee: pricing?.pricePerMonth ?? prev.monthlyFee,
                          }))
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg ${
                          errors.spaceId ? 'border-rose-300' : 'border-slate-200'
                        }`}
                      >
                        <option value="">{t('select_space')}</option>
                        {formData.buildingId
                          ? mockSpaces
                              .filter((s) => s.buildingId === formData.buildingId)
                              .map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.type.replace('_', ' ')})
                                </option>
                              ))
                          : mockSpaces.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.type.replace('_', ' ')})
                              </option>
                            ))}
                      </select>
                      {errors.spaceId && (
                        <p className="text-sm text-rose-500 mt-1">{errors.spaceId}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">{t('form_section_duration')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_start_date')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_duration_months')}
                      </label>
                      <select
                        name="durationMonths"
                        value={formData.durationMonths}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="3">{t('duration_3m')}</option>
                        <option value="6">{t('duration_6m')}</option>
                        <option value="12">{t('duration_12m')}</option>
                        <option value="24">{t('duration_24m')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                    {t('step2_label')}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('label_monthly_fee')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="monthlyFee"
                      value={formData.monthlyFee}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg ${
                        errors.monthlyFee ? 'border-rose-300' : 'border-slate-200'
                      }`}
                      placeholder="0"
                    />
                    {errors.monthlyFee && (
                      <p className="text-sm text-rose-500 mt-1">{errors.monthlyFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('label_setup_fee')}
                    </label>
                    <input
                      type="number"
                      name="setupFee"
                      value={formData.setupFee}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-4">{t('label_deposit')}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        {t('label_deposit_months')}
                      </label>
                      <select
                        name="depositMonths"
                        value={formData.depositMonths}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      >
                        <option value="1">{t('deposit_1m')}</option>
                        <option value="2">{t('deposit_2m')}</option>
                        <option value="3">{t('deposit_3m')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        {t('label_deposit_total')}
                      </label>
                      <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-semibold">
                        {formatCurrency(formData.depositAmount)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-slate-700">{t('label_amenities')}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {mockAmenities.map((am) => (
                      <label
                        key={am.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                          formData.selectedAmenities.includes(am.id)
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-sky-600 w-4 h-4"
                          checked={formData.selectedAmenities.includes(am.id)}
                          onChange={() => toggleAmenity(am.id)}
                        />
                        <span>{am.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Assets */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-orange-500" />
                    <h3 className="font-medium text-slate-700">{t('label_assets')}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {mockAssets.map((asset) => {
                      const selected = formData.selectedAssets.find((a) => a.id === asset.id)
                      return (
                        <div
                          key={asset.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all ${
                            selected
                              ? 'border-orange-400 bg-orange-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              className="accent-orange-600 w-4 h-4 shrink-0"
                              checked={!!selected}
                              onChange={() => toggleAsset(asset.id, asset.name)}
                            />
                            <span className="text-slate-700 truncate">{asset.name}</span>
                          </label>
                          {selected && (
                            <div className="flex items-center gap-1.5 ml-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => updateAssetQty(asset.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-slate-700">{selected.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateAssetQty(asset.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Services */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <ConciergeBell className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-medium text-slate-700">{t('label_services')}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mockServices.map((svc) => (
                      <label
                        key={svc.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                          formData.selectedServices.includes(svc.id)
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            className="accent-emerald-600 w-4 h-4"
                            checked={formData.selectedServices.includes(svc.id)}
                            onChange={() => toggleService(svc.id)}
                          />
                          <span className="text-slate-700">{svc.name}</span>
                        </div>
                        <span className="text-slate-500 font-medium">{formatCurrency(svc.monthlyFee)}/{t('month_short')}</span>
                      </label>
                    ))}
                  </div>
                  {totalServiceFee > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-sm">
                      <span className="text-slate-500">{t('label_service_total')}</span>
                      <span className="font-semibold text-emerald-700">{formatCurrency(totalServiceFee)}/{t('month_short')}</span>
                    </div>
                  )}
                </div>

                {/* Notification Days */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <h3 className="font-medium text-slate-700">{t('label_notification_section')}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_notify_customer_days')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="notifyCustomerDays"
                          value={formData.notifyCustomerDays}
                          onChange={handleChange}
                          min={7}
                          max={180}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <span className="text-sm text-slate-400 shrink-0">{t('unit_days')}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_notify_management_days')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="notifyManagementDays"
                          value={formData.notifyManagementDays}
                          onChange={handleChange}
                          min={7}
                          max={180}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <span className="text-sm text-slate-400 shrink-0">{t('unit_days')}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        {t('label_renewal_preparation_days')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="renewalPreparationDays"
                          value={formData.renewalPreparationDays}
                          onChange={handleChange}
                          min={14}
                          max={180}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <span className="text-sm text-slate-400 shrink-0">{t('unit_days')}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">{t('notify_hint')}</p>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="autoRenewalEnabled"
                      checked={formData.autoRenewalEnabled}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-sky-600"
                    />
                    <span className="font-medium text-slate-700">
                      {t('label_auto_renewal_toggle')}
                    </span>
                  </label>
                  {formData.autoRenewalEnabled && (
                    <div className="mt-4 pl-8 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">
                          {t('label_renewal_duration')}
                        </label>
                        <select
                          name="renewalDuration"
                          value={formData.renewalDuration}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="3">{t('duration_3m')}</option>
                          <option value="6">{t('duration_6m')}</option>
                          <option value="12">{t('duration_12m')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">
                          {t('label_renewal_pricing')}
                        </label>
                        <select
                          name="renewalPricing"
                          value={formData.renewalPricing}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="same">{t('renewal_pricing_same')}</option>
                          <option value="current_rate">{t('renewal_pricing_current_short')}</option>
                          <option value="custom">{t('renewal_pricing_custom')}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('label_notes')}
                  </label>
                  <textarea
                    name="customNotes"
                    value={formData.customNotes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                    placeholder={t('notes_placeholder')}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {t('step3_label')}
                </h2>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3">{t('preview_details_title')}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">{t('preview_space')}</span>{' '}
                      <span className="text-slate-900">
                        {formData.spaceName || t('preview_not_selected')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t('preview_duration')}</span>{' '}
                      <span className="text-slate-900">
                        {t('months_unit', { count: formData.durationMonths })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t('preview_customer')}</span>{' '}
                      <span className="text-slate-900">{formData.customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t('preview_building')}</span>{' '}
                      <span className="text-slate-900">{formData.buildingName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-3">{t('preview_finance_title')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">{t('label_monthly_fee')}</span>
                      <span className="font-medium text-emerald-900">
                        {formatCurrency(formData.monthlyFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">{t('label_deposit')}</span>
                      <span className="font-medium text-emerald-900">
                        {formatCurrency(formData.depositAmount)}
                      </span>
                    </div>
                    {formData.setupFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-700">{t('label_setup_fee')}</span>
                        <span className="font-medium text-emerald-900">
                          {formatCurrency(formData.setupFee)}
                        </span>
                      </div>
                    )}
                    {totalServiceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-700">{t('label_services')}</span>
                        <span className="font-medium text-emerald-900">
                          +{formatCurrency(totalServiceFee)}/{t('month_short')}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-emerald-200 pt-2 mt-2">
                      <div className="flex justify-between text-base">
                        <span className="font-medium text-emerald-800">{t('label_total_value')}</span>
                        <span className="font-bold text-emerald-900">
                          {formatCurrency(
                            (formData.monthlyFee + totalServiceFee) * formData.durationMonths + formData.setupFee
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview: Amenities / Assets / Services */}
                {(formData.selectedAmenities.length > 0 || formData.selectedAssets.length > 0 || formData.selectedServices.length > 0) && (
                  <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                    <h3 className="font-medium text-slate-700">{t('preview_included_title')}</h3>
                    {formData.selectedAmenities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{t('label_amenities')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.selectedAmenities.map((id) => {
                            const am = mockAmenities.find((a) => a.id === id)
                            return am ? (
                              <span key={id} className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{am.name}</span>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                    {formData.selectedAssets.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{t('label_assets')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.selectedAssets.map((a) => (
                            <span key={a.id} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              {a.name} ×{a.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.selectedServices.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{t('label_services')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.selectedServices.map((id) => {
                            const svc = mockServices.find((s) => s.id === id)
                            return svc ? (
                              <span key={id} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                {svc.name} ({formatCurrency(svc.monthlyFee)})
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview: Notification settings */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-3">{t('label_notification_section')}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-amber-600">{t('label_notify_customer_days')}</span>
                      <p className="font-medium text-amber-900">{formData.notifyCustomerDays} {t('unit_days')}</p>
                    </div>
                    <div>
                      <span className="text-amber-600">{t('label_notify_management_days')}</span>
                      <p className="font-medium text-amber-900">{formData.notifyManagementDays} {t('unit_days')}</p>
                    </div>
                    <div>
                      <span className="text-amber-600">{t('label_renewal_preparation_days')}</span>
                      <p className="font-medium text-amber-900">{formData.renewalPreparationDays} {t('unit_days')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={currentStep === 1 ? () => navigate('/contracts') : handlePrev}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? t('btn_cancel') : t('btn_prev')}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#8f1820]"
                >
                  {t('btn_next')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#8f1820] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending || updateMutation.isPending
                    ? t('btn_saving')
                    : isEdit
                    ? t('btn_update')
                    : t('btn_submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

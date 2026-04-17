import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBuildings, mockSpaces, mockPricingRules } from '../../mocks/propertyMocks'
import { mockCustomers } from '../../mocks/customerMocks'
import {
  useContract,
  useContractTemplates,
  useCreateContract,
  useUpdateContract,
} from '../../hooks/useContracts'
import type {
  CreateContractRequest,
  RenewalPricing,
} from '../../types/contract'

const STEPS = [
  { id: 1, label: 'Thông tin cơ bản', icon: FileText },
  { id: 2, label: 'Giá & Thanh toán', icon: DollarSign },
  { id: 3, label: 'Xem trước & Xác nhận', icon: Check },
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
  autoRenewalEnabled: false,
  renewalDuration: 6,
  renewalPricing: 'same',
  customNotes: '',
}

export function ContractFormPage() {
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

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 1) {
      if (!formData.templateId) newErrors.templateId = 'Vui lòng chọn mẫu hợp đồng'
      if (!formData.customerId) newErrors.customerId = 'Vui lòng chọn khách hàng'
      if (!formData.buildingId) newErrors.buildingId = 'Vui lòng chọn tòa nhà'
      if (!formData.spaceId) newErrors.spaceId = 'Vui lòng chọn không gian'
      if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu'
    }

    if (step === 2) {
      if (!formData.monthlyFee || formData.monthlyFee <= 0) {
        newErrors.monthlyFee = 'Phí hàng tháng phải lớn hơn 0'
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
      } else {
        await createMutation.mutateAsync(requestData)
      }
      navigate('/contracts')
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
          title="Chỉnh sửa hợp đồng"
          subtitle="Đang tải..."
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-slate-500">Đang tải...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header
        title={isEdit ? 'Chỉnh sửa hợp đồng' : 'Tạo hợp đồng mới'}
        subtitle={isEdit ? contract?.contractCode : undefined}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => navigate('/contracts')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
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
                <span className="font-medium hidden sm:block">{step.label}</span>
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
                  Thông tin cơ bản
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mẫu hợp đồng <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="templateId"
                    value={formData.templateId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.templateId ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Chọn mẫu hợp đồng</option>
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
                    <span className="font-medium text-slate-700">Khách hàng</span>
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
                    <option value="">Chọn khách hàng</option>
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
                    <span className="font-medium text-slate-700">Địa điểm</span>
                    <span className="text-rose-500">*</span>
                  </div>
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
                    <option value="">Chọn tòa nhà</option>
                    {mockBuildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {errors.buildingId && (
                    <p className="text-sm text-rose-500 mt-1">{errors.buildingId}</p>
                  )}

                  {formData.buildingId && (
                    <div className="mt-3">
                      <label className="block text-sm text-slate-500 mb-1">
                        Không gian <span className="text-rose-500">*</span>
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
                        <option value="">Chọn không gian</option>
                        {mockSpaces
                          .filter((s) => s.buildingId === formData.buildingId)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.type.replace('_', ' ')})
                            </option>
                          ))}
                      </select>
                      {errors.spaceId && (
                        <p className="text-sm text-rose-500 mt-1">{errors.spaceId}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">Thời hạn</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        Ngày bắt đầu <span className="text-rose-500">*</span>
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
                        Thời hạn (tháng)
                      </label>
                      <select
                        name="durationMonths"
                        value={formData.durationMonths}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        <option value="3">3 tháng</option>
                        <option value="6">6 tháng</option>
                        <option value="12">12 tháng</option>
                        <option value="24">24 tháng</option>
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
                  Giá & Thanh toán
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phí hàng tháng <span className="text-rose-500">*</span>
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
                      Phí setup
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
                  <h3 className="font-medium text-slate-700 mb-4">Tiền đặt cọc</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        Số tháng đặt cọc
                      </label>
                      <select
                        name="depositMonths"
                        value={formData.depositMonths}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      >
                        <option value="1">1 tháng</option>
                        <option value="2">2 tháng</option>
                        <option value="3">3 tháng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        Tổng tiền đặt cọc
                      </label>
                      <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg font-semibold">
                        {formatCurrency(formData.depositAmount)}
                      </div>
                    </div>
                  </div>
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
                      Bật gia hạn tự động
                    </span>
                  </label>
                  {formData.autoRenewalEnabled && (
                    <div className="mt-4 pl-8 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">
                          Thời hạn gia hạn
                        </label>
                        <select
                          name="renewalDuration"
                          value={formData.renewalDuration}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="3">3 tháng</option>
                          <option value="6">6 tháng</option>
                          <option value="12">12 tháng</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">
                          Giá khi gia hạn
                        </label>
                        <select
                          name="renewalPricing"
                          value={formData.renewalPricing}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="same">Giữ nguyên</option>
                          <option value="current_rate">Theo bảng giá</option>
                          <option value="custom">Tùy chỉnh</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="customNotes"
                    value={formData.customNotes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                    placeholder="Ghi chú cho hợp đồng..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Xem trước & Xác nhận
                </h2>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3">Chi tiết hợp đồng</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Không gian:</span>{' '}
                      <span className="text-slate-900">
                        {formData.spaceName || 'Chưa chọn'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Thời hạn:</span>{' '}
                      <span className="text-slate-900">
                        {formData.durationMonths} tháng
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Khách hàng:</span>{' '}
                      <span className="text-slate-900">{formData.customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Tòa nhà:</span>{' '}
                      <span className="text-slate-900">{formData.buildingName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-3">Tài chính</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Phí hàng tháng</span>
                      <span className="font-medium text-emerald-900">
                        {formatCurrency(formData.monthlyFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Tiền đặt cọc</span>
                      <span className="font-medium text-emerald-900">
                        {formatCurrency(formData.depositAmount)}
                      </span>
                    </div>
                    {formData.setupFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Phí setup</span>
                        <span className="font-medium text-emerald-900">
                          {formatCurrency(formData.setupFee)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-emerald-200 pt-2 mt-2">
                      <div className="flex justify-between text-base">
                        <span className="font-medium text-emerald-800">Tổng giá trị HĐ</span>
                        <span className="font-bold text-emerald-900">
                          {formatCurrency(
                            formData.monthlyFee * formData.durationMonths + formData.setupFee
                          )}
                        </span>
                      </div>
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
                {currentStep === 1 ? 'Hủy' : 'Quay lại'}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                >
                  Tiếp theo
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Đang lưu...'
                    : isEdit
                    ? 'Cập nhật hợp đồng'
                    : 'Tạo hợp đồng'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

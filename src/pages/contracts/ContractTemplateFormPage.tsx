import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileText,
  ArrowLeft,
  Save,
  Eye,
  Building2,
  Users,
  DollarSign,
  ScrollText,
  Shield,
  XCircle,
  PenTool,
  Layers,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import {
  useContractTemplate,
  useCreateContractTemplate,
  useUpdateContractTemplate,
} from '../../hooks/useContracts'
import type { CreateContractTemplateRequest } from '../../types/contract'

// Template sections configuration
const TEMPLATE_SECTIONS = [
  { id: 'header', icon: FileText, placeholder: '{{contractCode}}, {{signedDate}}' },
  { id: 'partyLessor', icon: Building2, placeholder: '{{companyName}}, {{companyTaxCode}}' },
  { id: 'partyLessee', icon: Users, placeholder: '{{customerName}}, {{customerId}}' },
  { id: 'service', icon: Layers, placeholder: '{{spaceType}}, {{buildingName}}, {{duration}}' },
  { id: 'pricing', icon: DollarSign, placeholder: '{{monthlyFee}}, {{deposit}}' },
  { id: 'usageRules', icon: ScrollText, placeholder: '{{operatingHours}}' },
  { id: 'liability', icon: Shield, placeholder: '' },
  { id: 'termination', icon: XCircle, placeholder: '' },
  { id: 'signature', icon: PenTool, placeholder: '{{companyRepName}}, {{customerName}}' },
] as const

type SectionKey = typeof TEMPLATE_SECTIONS[number]['id']

// Common placeholders for reference
const COMMON_PLACEHOLDERS = [
  { key: '{{contractCode}}', labelKey: 'ph_contract_code' },
  { key: '{{signedDate}}', labelKey: 'ph_signed_date' },
  { key: '{{startDate}}', labelKey: 'ph_start_date' },
  { key: '{{endDate}}', labelKey: 'ph_end_date' },
  { key: '{{duration}}', labelKey: 'ph_duration' },
  { key: '{{customerName}}', labelKey: 'ph_customer_name' },
  { key: '{{customerType}}', labelKey: 'ph_customer_type' },
  { key: '{{customerId}}', labelKey: 'ph_customer_id' },
  { key: '{{customerAddress}}', labelKey: 'ph_customer_address' },
  { key: '{{companyName}}', labelKey: 'ph_company_name' },
  { key: '{{companyTaxCode}}', labelKey: 'ph_company_tax' },
  { key: '{{companyAddress}}', labelKey: 'ph_company_address' },
  { key: '{{companyRepName}}', labelKey: 'ph_rep_name' },
  { key: '{{buildingName}}', labelKey: 'ph_building_name' },
  { key: '{{buildingAddress}}', labelKey: 'ph_building_address' },
  { key: '{{spaceType}}', labelKey: 'ph_space_type' },
  { key: '{{spaceName}}', labelKey: 'ph_space_name' },
  { key: '{{monthlyFee}}', labelKey: 'ph_monthly_fee' },
  { key: '{{setupFee}}', labelKey: 'ph_setup_fee' },
  { key: '{{deposit}}', labelKey: 'ph_deposit' },
  { key: '{{totalValue}}', labelKey: 'ph_total_value' },
  { key: '{{operatingHours}}', labelKey: 'ph_operating_hours' },
]

// Default template content
const DEFAULT_TEMPLATES: Record<SectionKey, string> = {
  header: `<div style="text-align: center;">
  <h1>HỢP ĐỒNG THUÊ DỊCH VỤ COWORKING</h1>
  <p>Số: <strong>{{contractCode}}</strong></p>
  <p>Ngày ký: <strong>{{signedDate}}</strong></p>
</div>`,
  partyLessor: `<div>
  <h2>BÊN CHO THUÊ (Bên A)</h2>
  <p><strong>{{companyName}}</strong></p>
  <p>Mã số thuế: {{companyTaxCode}}</p>
  <p>Địa chỉ: {{companyAddress}}</p>
  <p>Người đại diện: {{companyRepName}}</p>
</div>`,
  partyLessee: `<div>
  <h2>BÊN THUÊ (Bên B)</h2>
  <p><strong>{{customerName}}</strong> ({{customerType}})</p>
  <p>CCCD/MST: {{customerId}}</p>
  <p>Địa chỉ: {{customerAddress}}</p>
</div>`,
  service: `<div>
  <h2>ĐIỀU 1: DỊCH VỤ THUÊ</h2>
  <p>Bên A đồng ý cho Bên B thuê:</p>
  <ul>
    <li>Loại dịch vụ: <strong>{{spaceType}}</strong></li>
    <li>Không gian: {{spaceName}}</li>
    <li>Tại: {{buildingName}}, {{buildingAddress}}</li>
    <li>Thời gian: {{duration}} tháng (từ {{startDate}} đến {{endDate}})</li>
    <li>Giờ sử dụng: {{operatingHours}}</li>
  </ul>
</div>`,
  pricing: `<div>
  <h2>ĐIỀU 2: GIÁ THUÊ VÀ THANH TOÁN</h2>
  <p>1. Giá thuê hàng tháng: <strong>{{monthlyFee}}</strong> VND</p>
  <p>2. Phí setup (một lần): {{setupFee}} VND</p>
  <p>3. Tiền đặt cọc: {{deposit}} VND</p>
  <p>4. Tổng giá trị hợp đồng: <strong>{{totalValue}}</strong> VND</p>
  <p>5. Phương thức thanh toán: Chuyển khoản vào tài khoản Bên A trước ngày 05 hàng tháng.</p>
</div>`,
  usageRules: `<div>
  <h2>ĐIỀU 3: QUY ĐỊNH SỬ DỤNG</h2>
  <p>1. Bên B được sử dụng không gian trong giờ {{operatingHours}}.</p>
  <p>2. Bên B không được gây tiếng ồn ảnh hưởng đến các khách hàng khác.</p>
  <p>3. Bên B chịu trách nhiệm giữ gìn vệ sinh chung.</p>
  <p>4. Không mang thức ăn có mùi mạnh vào khu vực làm việc chung.</p>
  <p>5. Khách của Bên B phải đăng ký tại quầy lễ tân.</p>
</div>`,
  liability: `<div>
  <h2>ĐIỀU 4: TRÁCH NHIỆM CÁC BÊN</h2>
  <h3>Trách nhiệm Bên A:</h3>
  <ul>
    <li>Đảm bảo cung cấp đầy đủ tiện ích theo cam kết</li>
    <li>Bảo trì, sửa chữa thiết bị khi có hư hỏng</li>
    <li>Đảm bảo an ninh, an toàn trong khu vực</li>
  </ul>
  <h3>Trách nhiệm Bên B:</h3>
  <ul>
    <li>Thanh toán đúng hạn</li>
    <li>Bảo quản tài sản và thiết bị</li>
    <li>Bồi thường nếu gây hư hỏng</li>
  </ul>
</div>`,
  termination: `<div>
  <h2>ĐIỀU 5: CHẤM DỨT HỢP ĐỒNG</h2>
  <p>1. Hợp đồng tự động hết hiệu lực khi hết thời hạn.</p>
  <p>2. Một bên muốn chấm dứt trước hạn phải thông báo bằng văn bản trước 30 ngày.</p>
  <p>3. Trường hợp chấm dứt do lỗi của một bên:</p>
  <ul>
    <li>Bên B vi phạm: Mất tiền đặt cọc</li>
    <li>Bên A vi phạm: Hoàn trả đặt cọc + phí bù đắp</li>
  </ul>
</div>`,
  signature: `<div style="display: flex; justify-content: space-between; margin-top: 50px;">
  <div style="text-align: center; width: 45%;">
    <p><strong>ĐẠI DIỆN BÊN A</strong></p>
    <p style="margin-top: 80px;">{{companyRepName}}</p>
    <p><em>(Ký tên, đóng dấu)</em></p>
  </div>
  <div style="text-align: center; width: 45%;">
    <p><strong>ĐẠI DIỆN BÊN B</strong></p>
    <p style="margin-top: 80px;">{{customerName}}</p>
    <p><em>(Ký tên)</em></p>
  </div>
</div>`,
}

type FormData = {
  name: string
  description: string
  isDefault: boolean
  sections: Record<SectionKey, string>
}

const initialFormData: FormData = {
  name: '',
  description: '',
  isDefault: false,
  sections: { ...DEFAULT_TEMPLATES },
}

export function ContractTemplateFormPage() {
  const { t } = useTranslation('contracts')
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cloneId = searchParams.get('clone')

  const isEdit = Boolean(id)
  const isClone = Boolean(cloneId)

  const [activeSection, setActiveSection] = useState<SectionKey>('header')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showPlaceholders, setShowPlaceholders] = useState(false)

  // Fetch existing template if editing or cloning
  const { data: existingTemplate, isLoading } = useContractTemplate(id || cloneId || '')
  const createMutation = useCreateContractTemplate()
  const updateMutation = useUpdateContractTemplate()

  // Initialize form with existing data
  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: isClone ? `${existingTemplate.name} (Copy)` : existingTemplate.name,
        description: existingTemplate.description || '',
        isDefault: isClone ? false : existingTemplate.isDefault,
        sections: {
          header: existingTemplate.headerTemplate,
          partyLessor: existingTemplate.partyLessorTemplate,
          partyLessee: existingTemplate.partyLesseeTemplate,
          service: existingTemplate.serviceTemplate,
          pricing: existingTemplate.pricingTemplate,
          usageRules: existingTemplate.usageRulesTemplate,
          liability: existingTemplate.liabilityTemplate,
          termination: existingTemplate.terminationTemplate,
          signature: existingTemplate.signatureTemplate,
        },
      })
    }
  }, [existingTemplate, isClone])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSectionChange = (section: SectionKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [section]: value },
    }))
  }

  const sectionLabels: Record<SectionKey, string> = {
    header: t('tpl_section_header'),
    partyLessor: t('tpl_section_lessor'),
    partyLessee: t('tpl_section_lessee'),
    service: t('tpl_section_service'),
    pricing: t('tpl_section_pricing'),
    usageRules: t('tpl_section_usage_rules'),
    liability: t('tpl_section_liability'),
    termination: t('tpl_section_termination'),
    signature: t('tpl_section_signature'),
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('tpl_err_name_required')
    }

    // Validate at least header section has content
    if (!formData.sections.header.trim()) {
      newErrors.header = t('tpl_err_header_required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const requestData: CreateContractTemplateRequest = {
      name: formData.name,
      description: formData.description || undefined,
      isDefault: formData.isDefault,
      headerTemplate: formData.sections.header,
      partyLessorTemplate: formData.sections.partyLessor,
      partyLesseeTemplate: formData.sections.partyLessee,
      serviceTemplate: formData.sections.service,
      pricingTemplate: formData.sections.pricing,
      usageRulesTemplate: formData.sections.usageRules,
      liabilityTemplate: formData.sections.liability,
      terminationTemplate: formData.sections.termination,
      signatureTemplate: formData.sections.signature,
    }

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...requestData })
      } else {
        await createMutation.mutateAsync(requestData)
      }
      navigate('/contracts/templates')
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById(`section-${activeSection}`) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const current = formData.sections[activeSection]
      const newValue = current.substring(0, start) + placeholder + current.substring(end)
      handleSectionChange(activeSection, newValue)
      // Focus and set cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
      }, 0)
    }
  }

  const generatePreview = () => {
    // Replace placeholders with sample data
    const sampleData: Record<string, string> = {
      '{{contractCode}}': 'CTR-20260417-001',
      '{{signedDate}}': '17/04/2026',
      '{{startDate}}': '01/05/2026',
      '{{endDate}}': '30/04/2027',
      '{{duration}}': '12',
      '{{customerName}}': 'Nguyễn Văn A',
      '{{customerType}}': 'Cá nhân',
      '{{customerId}}': '001234567890',
      '{{customerAddress}}': '123 Nguyễn Huệ, Q.1, TP.HCM',
      '{{companyName}}': 'Công ty TNHH Cobi Coworking Space',
      '{{companyTaxCode}}': '0123456789',
      '{{companyAddress}}': '456 Lê Lợi, Q.1, TP.HCM',
      '{{companyRepName}}': 'Trần Thị B',
      '{{buildingName}}': 'Cobi Tower 1',
      '{{buildingAddress}}': '456 Lê Lợi, Q.1, TP.HCM',
      '{{spaceType}}': 'Dedicated Desk',
      '{{spaceName}}': 'Dedicated Desk Zone A-01',
      '{{monthlyFee}}': '8,000,000',
      '{{setupFee}}': '1,000,000',
      '{{deposit}}': '16,000,000',
      '{{totalValue}}': '97,000,000',
      '{{operatingHours}}': '08:00 - 20:00',
    }

    let preview = ''
    Object.values(formData.sections).forEach((content) => {
      let processed = content
      Object.entries(sampleData).forEach(([key, value]) => {
        processed = processed.split(key).join(value)
      })
      preview += processed + '\n'
    })
    return preview
  }

  if ((id || cloneId) && isLoading) {
    return (
      <>
        <Header
          title={isEdit ? t('tpl_form_edit_title') : t('tpl_form_create_title')}
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
        title={isEdit ? t('tpl_form_edit_title') : isClone ? t('tpl_form_clone_title') : t('tpl_form_create_title')}
        subtitle={isEdit ? existingTemplate?.templateCode : undefined}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit}>
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/contracts/templates')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('btn_back_list')}
          </button>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="col-span-1 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">{t('tpl_basic_info')}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('tpl_label_name')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        errors.name ? 'border-rose-300' : 'border-slate-300'
                      }`}
                      placeholder={t('tpl_name_placeholder')}
                    />
                    {errors.name && <p className="text-sm text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('tpl_label_description')}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                      placeholder={t('tpl_description_placeholder')}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-slate-700">
                      {t('tpl_label_is_default')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tpl_sections_title')}</h3>
                <div className="space-y-1">
                  {TEMPLATE_SECTIONS.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                          activeSection === section.id
                            ? 'bg-sky-100 text-sky-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {sectionLabels[section.id]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Placeholders Reference */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <button
                  type="button"
                  onClick={() => setShowPlaceholders(!showPlaceholders)}
                  className="w-full flex items-center justify-between text-sm font-medium text-slate-700"
                >
                  <span>{t('tpl_placeholders_title')}</span>
                  <span className={`transition ${showPlaceholders ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showPlaceholders && (
                  <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                    {COMMON_PLACEHOLDERS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => insertPlaceholder(p.key)}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded hover:bg-slate-100 text-left"
                      >
                        <code className="text-sky-600">{p.key}</code>
                          <span className="text-slate-500">{t(p.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Section Editor */}
            <div className="col-span-2 space-y-6">
              {/* Editor Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {sectionLabels[activeSection]}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {t('tpl_common_placeholders')}{' '}
                      <span className="text-sky-600">
                        {TEMPLATE_SECTIONS.find((s) => s.id === activeSection)?.placeholder}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition ${
                      showPreview
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? t('tpl_btn_hide_preview') : t('tpl_btn_show_preview')}
                  </button>
                </div>

                <textarea
                  id={`section-${activeSection}`}
                  value={formData.sections[activeSection]}
                  onChange={(e) => handleSectionChange(activeSection, e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
                  placeholder={t('tpl_editor_placeholder')}
                />
                {errors[activeSection] && (
                  <p className="text-sm text-rose-500 mt-1">{errors[activeSection]}</p>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-slate-500">{t('tpl_quick_add')}</span>
                  {COMMON_PLACEHOLDERS.slice(0, 5).map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => insertPlaceholder(p.key)}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                    >
                      {p.key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              {showPreview && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('tpl_preview_title')}</h2>
                  <div
                    className="prose prose-sm max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: generatePreview() }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contracts/templates')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                    {t('btn_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending || updateMutation.isPending
                    ? t('btn_saving')
                    : isEdit
                    ? t('tpl_btn_update')
                    : t('tpl_btn_submit')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}

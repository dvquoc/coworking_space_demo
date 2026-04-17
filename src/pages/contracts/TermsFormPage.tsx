import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import {
  useTermsById,
  useCreateTerms,
  useUpdateTerms,
} from '../../hooks/useContracts'
import type { SpaceType, CreateTermsRequest } from '../../types/contract'

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  meeting_room: 'Phòng họp',
  event_space: 'Event Space',
}

type FormData = {
  title: string
  usageRulesContent: string
  liabilityContent: string
  privacyContent: string
  cancellationContent: string
  applicableSpaceTypes: SpaceType[]
  effectiveFrom: string
}

const initialFormData: FormData = {
  title: '',
  usageRulesContent: '',
  liabilityContent: '',
  privacyContent: '',
  cancellationContent: '',
  applicableSpaceTypes: [],
  effectiveFrom: new Date().toISOString().slice(0, 10),
}

export function TermsFormPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id) && !searchParams.get('clone')
  const cloneId = searchParams.get('clone')

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [activeTab, setActiveTab] = useState<'usage' | 'liability' | 'privacy' | 'cancellation'>('usage')
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

  const { data: existingTerms, isLoading } = useTermsById(id || cloneId || '')
  const createMutation = useCreateTerms()
  const updateMutation = useUpdateTerms()

  useEffect(() => {
    if (existingTerms) {
      setFormData({
        title: cloneId ? `${existingTerms.title} (Copy)` : existingTerms.title,
        usageRulesContent: existingTerms.usageRulesContent || '',
        liabilityContent: existingTerms.liabilityContent || '',
        privacyContent: existingTerms.privacyContent || '',
        cancellationContent: existingTerms.cancellationContent || '',
        applicableSpaceTypes: existingTerms.applicableSpaceTypes || [],
        effectiveFrom: existingTerms.effectiveFrom || new Date().toISOString().slice(0, 10),
      })
    }
  }, [existingTerms, cloneId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSpaceTypeChange = (spaceType: SpaceType) => {
    setFormData((prev) => ({
      ...prev,
      applicableSpaceTypes: prev.applicableSpaceTypes.includes(spaceType)
        ? prev.applicableSpaceTypes.filter((t) => t !== spaceType)
        : [...prev.applicableSpaceTypes, spaceType],
    }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề'
    }
    if (!formData.usageRulesContent.trim()) {
      newErrors.usageRulesContent = 'Vui lòng nhập quy định sử dụng'
    }
    if (!formData.liabilityContent.trim()) {
      newErrors.liabilityContent = 'Vui lòng nhập trách nhiệm các bên'
    }
    if (formData.applicableSpaceTypes.length === 0) {
      newErrors.applicableSpaceTypes = 'Vui lòng chọn ít nhất một loại không gian'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const requestData: CreateTermsRequest = {
      title: formData.title,
      usageRulesContent: formData.usageRulesContent,
      liabilityContent: formData.liabilityContent,
      privacyContent: formData.privacyContent,
      cancellationContent: formData.cancellationContent,
      applicableSpaceTypes: formData.applicableSpaceTypes,
      effectiveFrom: formData.effectiveFrom,
    }

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...requestData })
      } else {
        await createMutation.mutateAsync(requestData)
      }
      navigate('/contracts/terms')
    } catch (error) {
      console.error('Failed to save terms:', error)
    }
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'usage':
        return formData.usageRulesContent
      case 'liability':
        return formData.liabilityContent
      case 'privacy':
        return formData.privacyContent
      case 'cancellation':
        return formData.cancellationContent
    }
  }

  const setCurrentContent = (value: string) => {
    const fieldMap = {
      usage: 'usageRulesContent',
      liability: 'liabilityContent',
      privacy: 'privacyContent',
      cancellation: 'cancellationContent',
    }
    setFormData((prev) => ({
      ...prev,
      [fieldMap[activeTab]]: value,
    }))
  }

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br/>')
  }

  if ((id || cloneId) && isLoading) {
    return (
      <>
        <Header
          title={isEdit ? 'Chỉnh sửa điều khoản' : 'Tạo điều khoản mới'}
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
        title={isEdit ? 'Chỉnh sửa điều khoản' : cloneId ? 'Nhân bản điều khoản' : 'Tạo điều khoản mới'}
        subtitle={isEdit ? existingTerms?.termsCode : undefined}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => navigate('/contracts/terms')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tiêu đề <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="VD: Điều khoản sử dụng Hot Desk"
                    className={`w-full px-4 py-2.5 border rounded-lg ${
                      errors.title ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-rose-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Áp dụng cho loại không gian <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(SPACE_TYPE_LABELS) as [SpaceType, string][]).map(
                      ([value, label]) => (
                        <label
                          key={value}
                          className={`inline-flex items-center px-3 py-1.5 border rounded-lg cursor-pointer text-sm ${
                            formData.applicableSpaceTypes.includes(value)
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.applicableSpaceTypes.includes(value)}
                            onChange={() => handleSpaceTypeChange(value)}
                            className="sr-only"
                          />
                          {label}
                        </label>
                      )
                    )}
                  </div>
                  {errors.applicableSpaceTypes && (
                    <p className="text-sm text-rose-500 mt-1">{errors.applicableSpaceTypes}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ngày có hiệu lực
                  </label>
                  <input
                    type="date"
                    name="effectiveFrom"
                    value={formData.effectiveFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Nội dung điều khoản
                </h2>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-1.5 text-sm ${
                      viewMode === 'edit'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1.5 text-sm ${
                      viewMode === 'preview'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-4">
                {[
                  { key: 'usage', label: 'Quy định sử dụng' },
                  { key: 'liability', label: 'Trách nhiệm' },
                  { key: 'privacy', label: 'Bảo mật' },
                  { key: 'cancellation', label: 'Hủy dịch vụ' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {viewMode === 'edit' ? (
                <textarea
                  value={getCurrentContent()}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  rows={15}
                  placeholder="Nhập nội dung (hỗ trợ Markdown)..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm"
                />
              ) : (
                <div
                  className="min-h-[300px] p-4 border border-slate-200 rounded-lg bg-slate-50 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(getCurrentContent()) }}
                />
              )}

              {(activeTab === 'usage' && errors.usageRulesContent) ||
              (activeTab === 'liability' && errors.liabilityContent) ? (
                <p className="text-sm text-rose-500 mt-2">Vui lòng nhập nội dung</p>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Đang lưu...'
                    : isEdit
                    ? 'Cập nhật'
                    : 'Tạo mới'}
                </button>
                <button
                  onClick={() => navigate('/contracts/terms')}
                  className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2">💡 Mẹo</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Sử dụng # cho tiêu đề</li>
                <li>• Sử dụng **text** để in đậm</li>
                <li>• Sử dụng - để tạo danh sách</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

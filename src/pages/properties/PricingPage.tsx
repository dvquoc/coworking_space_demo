import { useState } from 'react'
import { DollarSign, Plus, FileText } from 'lucide-react'
import Header from '../../components/layout/Header'
import { usePricingRules } from '../../hooks/useProperties'
import type { SpaceType } from '../../types/property'
import { requiresContract } from '../../types/property'

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  open_space: 'Open Space',
  meeting_room: 'Meeting Room',
  conference_room: 'Conference Room',
  training_room: 'Training Room',
  event_space: 'Event Space',
}

export function PricingPage() {
  const [typeFilter, setTypeFilter] = useState<SpaceType | ''>('')
  const [activeOnly, setActiveOnly] = useState(true)
  
  const { data: pricingRules, isLoading, error } = usePricingRules({
    spaceType: typeFilter || undefined,
    isActive: activeOnly,
  })

  const formatPrice = (price?: number) => {
    if (!price) return '-'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <>
      <Header 
        title="Pricing Management" 
        subtitle="Quản lý giá thuê không gian"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Rules</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {pricingRules?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#b11e29]/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#b11e29]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Space Types</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {new Set(pricingRules?.map(pr => pr.spaceType).filter(Boolean)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Monthly Price</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {formatPrice(
                      (pricingRules?.reduce((sum, pr) => sum + (pr.pricePerMonth || 0), 0) || 0) / 
                      (pricingRules?.filter(pr => pr.pricePerMonth).length || 1)
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Pricing Rules</h2>
                <button className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as SpaceType | '')}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">All Space Types</option>
                  {Object.entries(SPACE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.target.checked)}
                    className="w-4 h-4 text-[#b11e29] border-slate-300 rounded focus:ring-[#b11e29]"
                  />
                  <span className="text-sm text-slate-700">Active rules only</span>
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Loading pricing rules...
                </div>
              ) : error ? (
                <div className="p-12 text-center text-rose-500">
                  Error loading pricing: {error.message}
                </div>
              ) : !pricingRules || pricingRules.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">No pricing rules found</p>
                  <p className="text-sm mt-1">Create pricing rules to manage space rental costs</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        Space Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                        Per Hour
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                        Per Day
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                        Per Week
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                        Per Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        Discounts
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pricingRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {rule.spaceType ? SPACE_TYPE_LABELS[rule.spaceType] : 'Custom'}
                            </span>
                            {rule.spaceType && requiresContract(rule.spaceType) && (
                              <span 
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                                title="Yêu cầu hợp đồng chính thức"
                              >
                                <FileText className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-900">
                          {formatPrice(rule.pricePerHour)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-900">
                          {formatPrice(rule.pricePerDay)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-900">
                          {formatPrice(rule.pricePerWeek)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-900 font-medium">
                          {formatPrice(rule.pricePerMonth)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {rule.weekendDiscount && (
                            <span className="text-emerald-600">
                              Weekend: {rule.weekendDiscount}%
                            </span>
                          )}
                          {rule.longTermDiscount && rule.longTermDiscount.length > 0 && (
                            <span className="text-blue-600 ml-2">
                              Long-term: {rule.longTermDiscount.length} tiers
                            </span>
                          )}
                          {!rule.weekendDiscount && (!rule.longTermDiscount || rule.longTermDiscount.length === 0) && (
                            <span className="text-slate-400">No discounts</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <button className="text-[#b11e29] hover:text-[#8f1821] font-medium">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

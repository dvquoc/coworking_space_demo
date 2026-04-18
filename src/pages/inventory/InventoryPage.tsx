import { useState, useMemo } from 'react'
import {
  Package, Wrench, Plus, Search, X, CheckCircle2,
  AlertTriangle, Edit2, Trash2, ChevronDown,
  MapPin, RotateCcw,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Header from '../../components/layout/Header'
import {
  useAssets,
  useCreateAsset,
  useUpdateAsset,
  useDeleteAsset,
  useMaintenanceLogs,
  useCreateMaintenanceLog,
  useCompleteMaintenanceLog,
  useCancelMaintenanceLog,
} from '../../hooks/useInventory'
import { mockBuildings, mockSpaces } from '../../mocks/propertyMocks'
import type {
  AssetCategory,
  AssetStatus,
  AssetCondition,
  MaintenanceType,
  MaintenanceStatus,
  Asset,
  MaintenanceLog,
} from '../../types/inventory'

// ─── Config ───────────────────────────────────────────────────

const CATEGORY_CFG: Record<AssetCategory, { labelKey: string; badge: string }> = {
  furniture:        { labelKey: 'category_furniture',        badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  it_equipment:     { labelKey: 'category_it_equipment',     badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  appliance:        { labelKey: 'category_appliance',        badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  office_equipment: { labelKey: 'category_office_equipment', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  pantry:           { labelKey: 'category_pantry',           badge: 'bg-green-50 text-green-700 border-green-200' },
  other:            { labelKey: 'category_other',            badge: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const STATUS_CFG: Record<AssetStatus, { labelKey: string; badge: string; dot: string }> = {
  active:      { labelKey: 'status_active',      badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500' },
  available:   { labelKey: 'status_available',    badge: 'bg-slate-100 text-slate-600 border-slate-200',   dot: 'bg-slate-400' },
  maintenance: { labelKey: 'status_maintenance',  badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  broken:      { labelKey: 'status_broken',       badge: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500' },
  retired:     { labelKey: 'status_retired',      badge: 'bg-slate-50 text-slate-400 border-slate-200',    dot: 'bg-slate-300' },
}

const CONDITION_CFG: Record<AssetCondition, { labelKey: string; badge: string }> = {
  excellent: { labelKey: 'condition_excellent', badge: 'text-emerald-600' },
  good:      { labelKey: 'condition_good',      badge: 'text-blue-600' },
  fair:      { labelKey: 'condition_fair',       badge: 'text-yellow-600' },
  poor:      { labelKey: 'condition_poor',       badge: 'text-orange-600' },
  broken:    { labelKey: 'condition_broken',     badge: 'text-red-600' },
}

const MTYPE_CFG: Record<MaintenanceType, { labelKey: string; badge: string }> = {
  routine:    { labelKey: 'mtype_routine',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  repair:     { labelKey: 'mtype_repair',     badge: 'bg-red-50 text-red-700 border-red-200' },
  inspection: { labelKey: 'mtype_inspection', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const MSTATUS_CFG: Record<MaintenanceStatus, { labelKey: string; badge: string }> = {
  scheduled:   { labelKey: 'mstatus_scheduled',    badge: 'bg-slate-100 text-slate-600' },
  in_progress: { labelKey: 'mstatus_in_progress',  badge: 'bg-yellow-50 text-yellow-700' },
  completed:   { labelKey: 'mstatus_completed',     badge: 'bg-green-50 text-green-700' },
  cancelled:   { labelKey: 'mstatus_cancelled',     badge: 'bg-red-50 text-red-600' },
}

// ─── Helpers ──────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}
function fmtDate(s?: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('vi-VN')
}

// ─── Types ────────────────────────────────────────────────────

type MainTab = 'assets' | 'maintenance'

// ─── Main Page ────────────────────────────────────────────────

export default function InventoryPage() {
  const { t } = useTranslation('inventory')
  const [tab, setTab] = useState<MainTab>('assets')

  // Asset filters
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<AssetCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all')
  const [buildingFilter, setBuildingFilter] = useState<string>('all')

  // Maintenance filters
  const [mTypeFilter, setMTypeFilter] = useState<MaintenanceType | 'all'>('all')
  const [mStatusFilter, setMStatusFilter] = useState<MaintenanceStatus | 'all'>('all')

  // Asset form modal
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null)
  const [reportBrokenAsset, setReportBrokenAsset] = useState<Asset | null>(null)
  const [brokenReason, setBrokenReason] = useState('')

  // Asset form state
  const [fName, setFName] = useState('')
  const [fCat, setFCat] = useState<AssetCategory>('it_equipment')
  const [fSerial, setFSerial] = useState('')
  const [fMfr, setFMfr] = useState('')
  const [fModel, setFModel] = useState('')
  const [fBuildingId, setFBuildingId] = useState('')
  const [fSpaceId, setFSpaceId] = useState('')
  const [fPurchaseDate, setFPurchaseDate] = useState('')
  const [fCost, setFCost] = useState('')
  const [fWarranty, setFWarranty] = useState('')
  const [fCondition, setFCondition] = useState<AssetCondition>('good')
  const [fNotes, setFNotes] = useState('')

  // Maintenance form modal
  const [showMaintForm, setShowMaintForm] = useState(false)
  const [mAssetId, setMAssetId] = useState('')
  const [mType, setMType] = useState<MaintenanceType>('routine')
  const [mDesc, setMDesc] = useState('')
  const [mScheduled, setMScheduled] = useState('')
  const [mCompleted, setMCompleted] = useState('')
  const [mCost, setMCost] = useState('0')
  const [mVendor, setMVendor] = useState('')
  const [mNotes, setMNotes] = useState('')

  // Complete maintenance modal
  const [completingLog, setCompletingLog] = useState<MaintenanceLog | null>(null)
  const [completeDate, setCompleteDate] = useState('')
  const [completeNotes, setCompleteNotes] = useState('')
  const [completeCondition, setCompleteCondition] = useState<AssetCondition>('good')

  // Queries
  const { data: assets = [], isLoading: assetsLoading } = useAssets()
  const { data: logs = [], isLoading: logsLoading } = useMaintenanceLogs()

  const createAsset = useCreateAsset()
  const updateAsset = useUpdateAsset()
  const deleteAsset = useDeleteAsset()
  const createLog = useCreateMaintenanceLog()
  const completeLog = useCompleteMaintenanceLog()
  const cancelLog = useCancelMaintenanceLog()

  // Derived spaces for building filter
  const buildingSpaces = useMemo(
    () => mockSpaces.filter(s => s.buildingId === fBuildingId),
    [fBuildingId]
  )

  // Filtered assets
  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase()
    return assets.filter(a => {
      if (q && !a.name.toLowerCase().includes(q) && !a.assetCode.toLowerCase().includes(q) && !a.serialNumber?.toLowerCase().includes(q)) return false
      if (catFilter !== 'all' && a.category !== catFilter) return false
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (buildingFilter !== 'all' && a.buildingId !== buildingFilter) return false
      return true
    })
  }, [assets, search, catFilter, statusFilter, buildingFilter])

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      if (mTypeFilter !== 'all' && l.type !== mTypeFilter) return false
      if (mStatusFilter !== 'all' && l.status !== mStatusFilter) return false
      return true
    })
  }, [logs, mTypeFilter, mStatusFilter])

  // Stats
  const stats = useMemo(() => ({
    total: assets.length,
    active: assets.filter(a => a.status === 'active').length,
    available: assets.filter(a => a.status === 'available').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    broken: assets.filter(a => a.status === 'broken').length,
  }), [assets])

  // ── Handlers ──────────────────────────────────────────────

  function openAddAsset() {
    setEditingAsset(null)
    setFName(''); setFCat('it_equipment'); setFSerial(''); setFMfr('')
    setFModel(''); setFBuildingId(''); setFSpaceId(''); setFPurchaseDate('')
    setFCost(''); setFWarranty(''); setFCondition('good'); setFNotes('')
    setShowAssetForm(true)
  }

  function openEditAsset(asset: Asset) {
    setEditingAsset(asset)
    setFName(asset.name); setFCat(asset.category); setFSerial(asset.serialNumber ?? '')
    setFMfr(asset.manufacturer ?? ''); setFModel(asset.model ?? '')
    setFBuildingId(asset.buildingId); setFSpaceId(asset.spaceId ?? '')
    setFPurchaseDate(asset.purchaseDate ?? ''); setFCost(String(asset.purchaseCost))
    setFWarranty(asset.warrantyExpiryDate ?? ''); setFCondition(asset.condition)
    setFNotes(asset.notes ?? '')
    setShowAssetForm(true)
  }

  async function handleAssetSubmit() {
    const payload = {
      name: fName, category: fCat, serialNumber: fSerial || undefined,
      manufacturer: fMfr || undefined, model: fModel || undefined,
      buildingId: fBuildingId, spaceId: fSpaceId || undefined,
      purchaseDate: fPurchaseDate || undefined, purchaseCost: Number(fCost) || 0,
      warrantyExpiryDate: fWarranty || undefined, condition: fCondition,
      notes: fNotes || undefined,
    }
    if (editingAsset) {
      await updateAsset.mutateAsync({ id: editingAsset.id, ...payload })
    } else {
      await createAsset.mutateAsync(payload)
    }
    setShowAssetForm(false)
  }

  function openMaintForm(assetId = '') {
    setMAssetId(assetId); setMType('routine'); setMDesc(''); setMScheduled('')
    setMCompleted(''); setMCost('0'); setMVendor(''); setMNotes('')
    setShowMaintForm(true)
  }

  async function handleMaintSubmit() {
    await createLog.mutateAsync({
      assetId: mAssetId, type: mType, description: mDesc,
      scheduledDate: mScheduled || undefined, completedDate: mCompleted || undefined,
      cost: Number(mCost) || 0, vendor: mVendor || undefined,
      resultNotes: mNotes || undefined, performedBy: 'Admin',
    })
    setShowMaintForm(false)
  }

  async function handleCompleteLog() {
    if (!completingLog) return
    await completeLog.mutateAsync({
      id: completingLog.id,
      completedDate: completeDate || new Date().toISOString().split('T')[0],
      resultNotes: completeNotes || undefined,
      newCondition: completeCondition,
    })
    setCompletingLog(null)
  }

  async function handleReportBroken() {
    if (!reportBrokenAsset) return
    await updateAsset.mutateAsync({ id: reportBrokenAsset.id, status: 'broken', condition: 'poor' })
    await createLog.mutateAsync({
      assetId: reportBrokenAsset.id, type: 'repair',
      description: brokenReason || t('broken_default_reason'),
      cost: 0, status: 'scheduled', performedBy: 'Admin',
    })
    setReportBrokenAsset(null)
    setBrokenReason('')
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <>
      <Header title={t('page_title')} subtitle={t('page_subtitle')} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: t('stat_total'), value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50' },
              { label: t('stat_active'), value: stats.active, color: 'text-green-700', bg: 'bg-green-50' },
              { label: t('stat_available'), value: stats.available, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: t('stat_maintenance'), value: stats.maintenance, color: 'text-yellow-700', bg: 'bg-yellow-50' },
              { label: t('stat_broken'), value: stats.broken, color: 'text-red-700', bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
              {([
                { key: 'assets', label: t('tab_assets'), icon: Package },
                { key: 'maintenance', label: t('tab_maintenance'), icon: Wrench },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                    tab === key
                      ? 'border-[#b11e29] text-[#b11e29]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── Assets Tab ── */}
            {tab === 'assets' && (
              <div>
                {/* Filter bar */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={t('search_placeholder')}
                      className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    )}
                  </div>

                  <SelectFilter value={catFilter} onChange={v => setCatFilter(v as AssetCategory | 'all')}>
                    <option value="all">{t('filter_all_categories')}</option>
                    {(Object.keys(CATEGORY_CFG) as AssetCategory[]).map(k => (
                      <option key={k} value={k}>{t(CATEGORY_CFG[k].labelKey)}</option>
                    ))}
                  </SelectFilter>

                  <SelectFilter value={statusFilter} onChange={v => setStatusFilter(v as AssetStatus | 'all')}>
                    <option value="all">{t('filter_all_statuses')}</option>
                    {(Object.keys(STATUS_CFG) as AssetStatus[]).map(k => (
                      <option key={k} value={k}>{t(STATUS_CFG[k].labelKey)}</option>
                    ))}
                  </SelectFilter>

                  <SelectFilter value={buildingFilter} onChange={setBuildingFilter}>
                    <option value="all">{t('filter_all_buildings')}</option>
                    {mockBuildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </SelectFilter>

                  <button
                    onClick={openAddAsset}
                    className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] hover:bg-[#8f1821] text-white text-sm font-medium rounded-xl transition"
                  >
                    <Plus className="w-4 h-4" />
                    {t('btn_add_asset')}
                  </button>
                </div>

                {/* Table */}
                {assetsLoading ? (
                  <LoadingRows />
                ) : filteredAssets.length === 0 ? (
                  <EmptyState message={t('empty_assets')} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                          <th className="px-4 py-3">{t('col_code_name')}</th>
                          <th className="px-4 py-3">{t('col_category')}</th>
                          <th className="px-4 py-3">{t('col_location')}</th>
                          <th className="px-4 py-3">{t('col_condition')}</th>
                          <th className="px-4 py-3">{t('col_status')}</th>
                          <th className="px-4 py-3">{t('col_purchase_cost')}</th>
                          <th className="px-4 py-3 text-right">{t('col_actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3">
                              <p className="font-mono text-xs text-slate-400">{asset.assetCode}</p>
                              <p className="font-medium text-slate-800">{asset.name}</p>
                              {asset.serialNumber && (
                                <p className="text-xs text-slate-400">S/N: {asset.serialNumber}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${CATEGORY_CFG[asset.category].badge}`}>
                                {t(CATEGORY_CFG[asset.category].labelKey)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-slate-600">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-32">{asset.buildingName ?? '—'}</span>
                              </div>
                              {asset.spaceName && (
                                <p className="text-xs text-slate-400 mt-0.5 pl-5">{asset.spaceName}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${CONDITION_CFG[asset.condition].badge}`}>
                                {t(CONDITION_CFG[asset.condition].labelKey)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border font-medium ${STATUS_CFG[asset.status].badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[asset.status].dot}`} />
                                {t(STATUS_CFG[asset.status].labelKey)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {asset.purchaseCost > 0 ? fmt(asset.purchaseCost) : '—'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {['active', 'available'].includes(asset.status) && (
                                  <button
                                    onClick={() => { setReportBrokenAsset(asset); setBrokenReason('') }}
                                    title={t('tooltip_report_broken')}
                                    className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => openMaintForm(asset.id)}
                                  title={t('tooltip_add_maintenance')}
                                  className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                >
                                  <Wrench className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditAsset(asset)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteAssetId(asset.id)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Maintenance Tab ── */}
            {tab === 'maintenance' && (
              <div>
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
                  <SelectFilter value={mTypeFilter} onChange={v => setMTypeFilter(v as MaintenanceType | 'all')}>
                    <option value="all">{t('filter_all_types')}</option>
                    {(Object.keys(MTYPE_CFG) as MaintenanceType[]).map(k => (
                      <option key={k} value={k}>{t(MTYPE_CFG[k].labelKey)}</option>
                    ))}
                  </SelectFilter>

                  <SelectFilter value={mStatusFilter} onChange={v => setMStatusFilter(v as MaintenanceStatus | 'all')}>
                    <option value="all">{t('filter_all_statuses')}</option>
                    {(Object.keys(MSTATUS_CFG) as MaintenanceStatus[]).map(k => (
                      <option key={k} value={k}>{t(MSTATUS_CFG[k].labelKey)}</option>
                    ))}
                  </SelectFilter>

                  <button
                    onClick={() => openMaintForm()}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#b11e29] hover:bg-[#8f1821] text-white text-sm font-medium rounded-xl transition"
                  >
                    <Plus className="w-4 h-4" />
                    {t('btn_add_maintenance')}
                  </button>
                </div>

                {logsLoading ? (
                  <LoadingRows />
                ) : filteredLogs.length === 0 ? (
                  <EmptyState message={t('empty_maintenance')} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                          <th className="px-4 py-3">{t('col_asset')}</th>
                          <th className="px-4 py-3">{t('col_type')}</th>
                          <th className="px-4 py-3">{t('col_description')}</th>
                          <th className="px-4 py-3">{t('col_scheduled_date')}</th>
                          <th className="px-4 py-3">{t('col_completed_date')}</th>
                          <th className="px-4 py-3">{t('col_cost')}</th>
                          <th className="px-4 py-3">{t('col_status')}</th>
                          <th className="px-4 py-3 text-right">{t('col_actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3">
                              <p className="font-mono text-xs text-slate-400">{log.assetCode}</p>
                              <p className="font-medium text-slate-800 max-w-40 truncate">{log.assetName}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${MTYPE_CFG[log.type].badge}`}>
                                {t(MTYPE_CFG[log.type].labelKey)}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-48">
                              <p className="truncate text-slate-600">{log.description}</p>
                              {log.vendor && <p className="text-xs text-slate-400 mt-0.5">{log.vendor}</p>}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{fmtDate(log.scheduledDate)}</td>
                            <td className="px-4 py-3 text-slate-600">{fmtDate(log.completedDate)}</td>
                            <td className="px-4 py-3 text-slate-600">{fmt(log.cost)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${MSTATUS_CFG[log.status].badge}`}>
                                {t(MSTATUS_CFG[log.status].labelKey)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {['scheduled', 'in_progress'].includes(log.status) && (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setCompletingLog(log)
                                      setCompleteDate(new Date().toISOString().split('T')[0])
                                      setCompleteNotes('')
                                      setCompleteCondition('good')
                                    }}
                                    title={t('tooltip_complete')}
                                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => cancelLog.mutate(log.id)}
                                    title={t('tooltip_cancel_log')}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal: Asset Form ── */}
      {showAssetForm && (
        <Modal title={editingAsset ? t('modal_edit_asset') : t('modal_add_asset')} onClose={() => setShowAssetForm(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_asset_name')} *</label>
                <input value={fName} onChange={e => setFName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" placeholder={t('placeholder_asset_name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_category')} *</label>
                <select value={fCat} onChange={e => setFCat(e.target.value as AssetCategory)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                  {(Object.keys(CATEGORY_CFG) as AssetCategory[]).map(k => (
                    <option key={k} value={k}>{t(CATEGORY_CFG[k].labelKey)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_condition')} *</label>
                <select value={fCondition} onChange={e => setFCondition(e.target.value as AssetCondition)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                  {(Object.keys(CONDITION_CFG) as AssetCondition[]).map(k => (
                    <option key={k} value={k}>{t(CONDITION_CFG[k].labelKey)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_serial_number')}</label>
                <input value={fSerial} onChange={e => setFSerial(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" placeholder={t('placeholder_serial')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_manufacturer')}</label>
                <input value={fMfr} onChange={e => setFMfr(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" placeholder={t('placeholder_manufacturer')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_model')}</label>
                <input value={fModel} onChange={e => setFModel(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" placeholder={t('placeholder_model')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_purchase_cost')}</label>
                <input type="number" value={fCost} onChange={e => setFCost(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_building')} *</label>
                <select value={fBuildingId} onChange={e => { setFBuildingId(e.target.value); setFSpaceId('') }} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                  <option value="">{t('placeholder_select_building')}</option>
                  {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_space')}</label>
                <select value={fSpaceId} onChange={e => setFSpaceId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" disabled={!fBuildingId}>
                  <option value="">{t('placeholder_select_space')}</option>
                  {buildingSpaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_purchase_date')}</label>
                <input type="date" value={fPurchaseDate} onChange={e => setFPurchaseDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_warranty_date')}</label>
                <input type="date" value={fWarranty} onChange={e => setFWarranty(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_notes')}</label>
                <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAssetForm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm transition">
              {t('btn_cancel')}
            </button>
            <button
              onClick={handleAssetSubmit}
              disabled={!fName || !fBuildingId || createAsset.isPending || updateAsset.isPending}
              className="flex-1 px-4 py-2.5 bg-[#b11e29] hover:bg-[#8f1821] disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition"
            >
              {(createAsset.isPending || updateAsset.isPending) ? t('btn_saving') : editingAsset ? t('btn_update') : t('btn_add_asset')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Maintenance Form ── */}
      {showMaintForm && (
        <Modal title={t('modal_maintenance')} onClose={() => setShowMaintForm(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_asset')} *</label>
              <select value={mAssetId} onChange={e => setMAssetId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                <option value="">{t('placeholder_select_asset')}</option>
                {assets.filter(a => a.status !== 'retired').map(a => (
                  <option key={a.id} value={a.id}>{a.assetCode} – {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_maintenance_type')} *</label>
              <select value={mType} onChange={e => setMType(e.target.value as MaintenanceType)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                <option value="routine">{t('mtype_routine_select')}</option>
                <option value="repair">{t('mtype_repair_select')}</option>
                <option value="inspection">{t('mtype_inspection_select')}</option>
              </select>
              {mType === 'repair' && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {t('repair_warning')}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_work_description')} *</label>
              <textarea value={mDesc} onChange={e => setMDesc(e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none" placeholder={t('placeholder_work_desc')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_scheduled_date')}</label>
                <input type="date" value={mScheduled} onChange={e => setMScheduled(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_cost')} *</label>
                <input type="number" value={mCost} onChange={e => setMCost(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" min={0} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_vendor')}</label>
              <input value={mVendor} onChange={e => setMVendor(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" placeholder={t('placeholder_vendor')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_result_notes')}</label>
              <textarea value={mNotes} onChange={e => setMNotes(e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowMaintForm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm transition">{t('btn_cancel')}</button>
            <button
              onClick={handleMaintSubmit}
              disabled={!mAssetId || !mDesc || createLog.isPending}
              className="flex-1 px-4 py-2.5 bg-[#b11e29] hover:bg-[#8f1821] disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition"
            >
              {createLog.isPending ? t('btn_saving') : t('btn_submit_maintenance')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Complete Maintenance ── */}
      {completingLog && (
        <Modal title={t('modal_complete_maintenance')} onClose={() => setCompletingLog(null)}>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-medium text-slate-700">{completingLog.assetName}</p>
              <p className="text-slate-500 mt-0.5">{completingLog.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_completed_date')} *</label>
              <input type="date" value={completeDate} onChange={e => setCompleteDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_condition_after')}</label>
              <select value={completeCondition} onChange={e => setCompleteCondition(e.target.value as AssetCondition)} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent">
                {(Object.keys(CONDITION_CFG) as AssetCondition[]).map(k => (
                  <option key={k} value={k}>{t(CONDITION_CFG[k].labelKey)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_result')}</label>
              <textarea value={completeNotes} onChange={e => setCompleteNotes(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none" placeholder={t('placeholder_complete_result')} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setCompletingLog(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm transition">{t('btn_cancel')}</button>
            <button
              onClick={handleCompleteLog}
              disabled={!completeDate || completeLog.isPending}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition"
            >
              {completeLog.isPending ? t('btn_saving') : t('btn_confirm_complete')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Report Broken ── */}
      {reportBrokenAsset && (
        <Modal title={t('modal_report_broken')} onClose={() => setReportBrokenAsset(null)}>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
              <p className="font-medium text-orange-800">{reportBrokenAsset.name}</p>
              <p className="text-orange-600 mt-0.5 text-xs">{reportBrokenAsset.assetCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('label_incident_desc')} *</label>
              <textarea value={brokenReason} onChange={e => setBrokenReason(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none" placeholder={t('placeholder_broken_desc')} />
            </div>
            <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: t('broken_status_note') }} />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setReportBrokenAsset(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm transition">{t('btn_cancel')}</button>
            <button
              onClick={handleReportBroken}
              disabled={!brokenReason || updateAsset.isPending}
              className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition"
            >
              {updateAsset.isPending ? t('btn_processing') : t('btn_confirm_broken')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Delete Confirm ── */}
      {deleteAssetId && (
        <Modal title={t('modal_delete_asset')} onClose={() => setDeleteAssetId(null)}>
          <p className="text-slate-600 mb-6">{t('delete_confirm_message')}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteAssetId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm transition">{t('btn_cancel')}</button>
            <button
              onClick={() => { deleteAsset.mutate(deleteAssetId); setDeleteAssetId(null) }}
              disabled={deleteAsset.isPending}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition"
            >
              {t('btn_delete')}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ─── Shared small components ──────────────────────────────────

function SelectFilter({
  value, onChange, children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none bg-white"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="p-8 flex justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-[#b11e29] border-t-transparent rounded-full" />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 text-center">
      <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500">{message}</p>
    </div>
  )
}

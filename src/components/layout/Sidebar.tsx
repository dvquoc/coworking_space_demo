import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wrench, 
  BarChart3,
  Building2,
  Layers,
  LayoutGrid,
  FileSignature,
  DollarSign,
  ChevronDown,
  ChevronRight,
  List,
  FileStack,
  ScrollText,
  Calendar,
  CirclePlus,
  Tag,
  Percent,
  Ticket,
  Calculator,
  Wallet,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

interface SubMenuItem {
  path: string
  labelKey: string
  icon: React.ReactNode
}

interface NavItem {
  path: string
  labelKey: string
  icon: React.ReactNode
  roles: string[]
  subItems?: SubMenuItem[]
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    labelKey: 'dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/buildings',
    labelKey: 'buildings',
    icon: <Building2 className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/floors',
    labelKey: 'floors',
    icon: <Layers className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/spaces',
    labelKey: 'spaces',
    icon: <LayoutGrid className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/customers',
    labelKey: 'customers',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
  },
  {
    path: '/credits',
    labelKey: 'credits',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['admin', 'manager', 'accountant'],
  },
  {
    path: '/contracts',
    labelKey: 'contracts',
    icon: <FileSignature className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
    subItems: [
      {
        path: '/contracts',
        labelKey: 'contracts_list',
        icon: <List className="w-4 h-4" />,
      },
      {
        path: '/contracts/new',
        labelKey: 'contracts_new',
        icon: <CirclePlus className="w-4 h-4" />,
      },
      {
        path: '/contracts/templates',
        labelKey: 'contracts_templates',
        icon: <FileStack className="w-4 h-4" />,
      },
      {
        path: '/contracts/terms',
        labelKey: 'contracts_terms',
        icon: <ScrollText className="w-4 h-4" />,
      },
    ],
  },
  {
    path: '/bookings',
    labelKey: 'bookings',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
    subItems: [
      {
        path: '/bookings',
        labelKey: 'bookings_list',
        icon: <List className="w-4 h-4" />,
      },
      {
        path: '/bookings/status',
        labelKey: 'bookings_status',
        icon: <FileText className="w-4 h-4" />,
      },
      {
        path: '/bookings/new',
        labelKey: 'bookings_new',
        icon: <CirclePlus className="w-4 h-4" />,
      },
      {
        path: '/bookings/calendar',
        labelKey: 'bookings_calendar',
        icon: <LayoutGrid className="w-4 h-4" />,
      },
    ],
  },
  {
    path: '/invoices',
    labelKey: 'invoices',
    icon: <FileText className="w-5 h-5" />,
    roles: ['admin', 'manager', 'accountant'],
  },
  {
    path: '/pricing',
    labelKey: 'pricing',
    icon: <Tag className="w-5 h-5" />,
    roles: ['admin', 'manager', 'accountant', 'sale'],
    subItems: [
      {
        path: '/pricing/services',
        labelKey: 'pricing_services',
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        path: '/pricing/promotions',
        labelKey: 'pricing_promotions',
        icon: <Percent className="w-4 h-4" />,
      },
      {
        path: '/pricing/vouchers',
        labelKey: 'pricing_vouchers',
        icon: <Ticket className="w-4 h-4" />,
      },
      {
        path: '/pricing/calculator',
        labelKey: 'pricing_calculator',
        icon: <Calculator className="w-4 h-4" />,
      },
    ],
  },
  {
    path: '/maintenance',
    labelKey: 'maintenance',
    icon: <Wrench className="w-5 h-5" />,
    roles: ['admin', 'maintenance'],
  },
  {
    path: '/reports',
    labelKey: 'reports',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin', 'investor'],
  },
]

export default function Sidebar() {
  const { t } = useTranslation('nav')
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  // Menus that contain the currently active sub-item — derived directly from route
  const activeParents = navItems
    .filter((item) => item.subItems?.some((sub) => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')))
    .map((item) => item.path)

  const prevPathnameRef = useState(() => ({ value: location.pathname }))[0]
  const [extraExpanded, setExtraExpanded] = useState<string[]>([])

  // Reset manual expansions whenever the route changes
  if (prevPathnameRef.value !== location.pathname) {
    prevPathnameRef.value = location.pathname
    if (extraExpanded.length > 0) setExtraExpanded([])
  }

  const expandedMenus = Array.from(new Set([...activeParents, ...extraExpanded]))

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  )

  const toggleMenu = (path: string) => {
    // Active parent cannot be manually collapsed
    if (activeParents.includes(path)) return
    setExtraExpanded((prev) =>
      prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
    )
  }

  const isMenuActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'))
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  }

  const isSubItemActive = (path: string) => {
    if (path === '/contracts') {
      return location.pathname === '/contracts' || (location.pathname.startsWith('/contracts/') && !location.pathname.startsWith('/contracts/new') && !location.pathname.startsWith('/contracts/templates') && !location.pathname.startsWith('/contracts/terms'))
    }
    if (path === '/bookings') {
      return location.pathname === '/bookings' || (location.pathname.startsWith('/bookings/') && !location.pathname.startsWith('/bookings/status') && !location.pathname.startsWith('/bookings/new') && !location.pathname.startsWith('/bookings/calendar'))
    }
    if (path === '/pricing/promotions') {
      return location.pathname === '/pricing/promotions'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#b11e29]" />
          <span className="text-lg font-bold">COBI TOWER</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {allowedNavItems.map((item) => (
            <li key={item.path}>
              {item.subItems ? (
                // Menu with submenu
                <div>
                  <button
                    onClick={() => toggleMenu(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      isMenuActive(item)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{t(item.labelKey)}</span>
                    </div>
                    {expandedMenus.includes(item.path) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {expandedMenus.includes(item.path) && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            end={subItem.path === '/contracts'}
                            className={() =>
                              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
                                isSubItemActive(subItem.path)
                                  ? 'bg-[#b11e29] text-white'
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`
                            }
                          >
                            {subItem.icon}
                            <span>{t(subItem.labelKey)}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular menu item
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? 'bg-[#b11e29] text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium">{t(item.labelKey)}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        © 2026 Coworking Space
      </div>
    </aside>
  )
}

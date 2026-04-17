import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wrench, 
  BarChart3,
  Building2,
  Layers,
  LayoutGrid,
  DollarSign,
  FileSignature,
  ChevronDown,
  ChevronRight,
  List,
  FileStack,
  ScrollText,
  Calendar,
  CirclePlus,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

interface SubMenuItem {
  path: string
  label: string
  icon: React.ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  roles: string[]
  subItems?: SubMenuItem[]
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/buildings',
    label: 'Tòa nhà',
    icon: <Building2 className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/floors',
    label: 'Tầng',
    icon: <Layers className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/spaces',
    label: 'Không gian',
    icon: <LayoutGrid className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    path: '/properties/pricing',
    label: 'Giá thuê',
    icon: <DollarSign className="w-5 h-5" />,
    roles: ['admin', 'manager', 'accountant'],
  },
  {
    path: '/customers',
    label: 'Khách hàng',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
  },
  {
    path: '/contracts',
    label: 'Hợp đồng',
    icon: <FileSignature className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
    subItems: [
      {
        path: '/contracts',
        label: 'Danh sách HĐ',
        icon: <List className="w-4 h-4" />,
      },
      {
        path: '/contracts/new',
        label: 'Tạo hợp đồng',
        icon: <CirclePlus className="w-4 h-4" />,
      },
      {
        path: '/contracts/templates',
        label: 'Mẫu hợp đồng',
        icon: <FileStack className="w-4 h-4" />,
      },
      {
        path: '/contracts/terms',
        label: 'Điều khoản T&C',
        icon: <ScrollText className="w-4 h-4" />,
      },
    ],
  },
  {
    path: '/bookings',
    label: 'Đặt chỗ',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['admin', 'manager', 'sale'],
    subItems: [
      {
        path: '/bookings',
        label: 'Danh sách đặt chỗ',
        icon: <List className="w-4 h-4" />,
      },
      {
        path: '/bookings/status',
        label: 'Theo dõi trạng thái',
        icon: <FileText className="w-4 h-4" />,
      },
      {
        path: '/bookings/new',
        label: 'Tạo mới',
        icon: <CirclePlus className="w-4 h-4" />,
      },
      {
        path: '/bookings/calendar',
        label: 'Xem lịch & Tạo',
        icon: <LayoutGrid className="w-4 h-4" />,
      },
    ],
  },
  {
    path: '/invoices',
    label: 'Hóa đơn',
    icon: <FileText className="w-5 h-5" />,
    roles: ['admin', 'manager', 'accountant'],
  },
  {
    path: '/maintenance',
    label: 'Bảo trì',
    icon: <Wrench className="w-5 h-5" />,
    roles: ['admin', 'maintenance'],
  },
  {
    path: '/reports',
    label: 'Báo cáo',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin', 'investor'],
  },
]

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['/contracts'])

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  )

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) =>
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
                      <span className="font-medium">{item.label}</span>
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
                            <span>{subItem.label}</span>
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
                  <span className="font-medium">{item.label}</span>
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

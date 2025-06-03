// Left navigation sidebar
import { NavLink } from 'react-router-dom'
import { Upload, BarChart3, MessageSquare, Database } from 'lucide-react'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Upload Data', href: '/upload', icon: Upload },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Insights', href: '/insights', icon: MessageSquare },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
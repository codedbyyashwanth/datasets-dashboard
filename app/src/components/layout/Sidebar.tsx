// Responsive sidebar with mobile close functionality
import { NavLink } from 'react-router-dom'
import { Upload, BarChart3, MessageSquare, X } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Upload Data', href: '/upload', icon: Upload },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Insights', href: '/insights', icon: MessageSquare },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      {/* Mobile close button */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="flex-1 mt-4 lg:mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={onClose} // Close sidebar on mobile when link is clicked
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
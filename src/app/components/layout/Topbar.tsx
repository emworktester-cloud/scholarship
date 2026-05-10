import { Search, Bell, Globe, Menu, LogOut, User, Settings, Key, UserCog, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from '../shared/NotificationCenter';
import { RoleIndicator } from '../rbac/RoleIndicator';
import { RoleId } from '../../lib/permissions';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenQuickSearch: () => void;
}

export function Topbar({ onToggleSidebar, onOpenQuickSearch }: TopbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-3 md:px-6 gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200/60 p-1 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#d4af37]/30 to-transparent rounded-xl opacity-50"></div>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s" 
              alt="Government Logo" 
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base font-bold text-slate-900 leading-none tracking-tight font-k2d whitespace-nowrap">
              ระบบบริหารจัดการทุนรัฐบาล
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">GSMS Platform</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-end md:justify-center lg:justify-start lg:ml-8 max-w-2xl px-2">
        {/* Mobile Search Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-500 rounded-full"
          onClick={() => onOpenQuickSearch()}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Desktop Search Bar */}
        <div className="relative w-full max-w-md group hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-[#1e3a8a] transition-colors z-10" />
          <div 
            onClick={() => onOpenQuickSearch()}
            className="w-full h-10 pl-10 pr-3 bg-slate-100/70 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-full flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <span className="text-sm text-slate-500 font-k2d truncate">ค้นหาใบสมัคร, ทุน, ประกาศ...</span>
            <kbd className="hidden lg:inline-flex shrink-0 h-5 items-center gap-1 rounded border border-slate-300 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3 shrink-0">
        <NotificationCenter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full hidden sm:flex">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 font-k2d">
            <DropdownMenuItem className="font-medium cursor-pointer">🇹🇭 ภาษาไทย</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-slate-600">🇬🇧 English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-1 md:px-2 hover:bg-slate-100 rounded-full transition-all">
              <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm shrink-0">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-gradient-to-br from-[#1e3a8a] to-blue-600 text-white font-semibold text-xs">
                  {user?.name?.slice(0, 2) || 'ผจ'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-700 leading-none font-k2d truncate max-w-[120px]">{user?.name || 'ผู้จัดการระบบ'}</span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase mt-1">{user?.role || 'Admin'}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 font-k2d rounded-xl">
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="bg-[#1e3a8a] text-white font-semibold">
                    {user?.name?.slice(0, 2) || 'ผจ'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">{user?.role}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <div className="p-1 space-y-1">
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-lg">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                ตั้งค่าบัญชี
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/my-permissions')} className="cursor-pointer rounded-lg">
                <Key className="mr-2 h-4 w-4 text-slate-500" />
                สิทธิ์การใช้งาน
              </DropdownMenuItem>
              {(user?.role === 'executive' || user?.role === 'staff') && (
                <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer rounded-lg">
                  <UserCog className="mr-2 h-4 w-4 text-slate-500" />
                  จัดการบัญชีผู้ใช้
                </DropdownMenuItem>
              )}
            </div>
            <DropdownMenuSeparator className="bg-slate-100" />
            <div className="p-1">
              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-lg font-medium" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
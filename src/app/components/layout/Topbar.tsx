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
    <header className="h-16 border-b bg-white flex items-center px-6 gap-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1e3a8a] flex items-center justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-[#1e3a8a]">
            ระบบบริหารจัดการทุนรัฐบาล
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาใบสมัคร/รหัส/ชื่อผู้สมัคร... (กด Ctrl+K)"
            className="pl-10 bg-secondary border-0 cursor-pointer"
            onClick={() => onOpenQuickSearch()}
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationCenter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>ไทย</DropdownMenuItem>
            <DropdownMenuItem>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-3">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-[#1e3a8a] text-white">
                  {user?.name?.slice(0, 2) || 'ผจ'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name || 'ผู้จัดการระบบ'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              ตั้งค่า
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/my-permissions')}>
              <Shield className="mr-2 h-4 w-4" />
              สิทธิ์ของฉัน
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <UserCog className="mr-2 h-4 w-4" />
              จัดการบัญชีผู้ใช้
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
import { Outlet, Link, useLocation } from "react-router";
import { Home, Send, Clock, Bell, User } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function MobileLayout() {
  const location = useLocation();

  const navItems = [
    { name: "หน้าหลัก", icon: Home, path: "/mobile/scholar" },
    { name: "ยื่นคำขอ", icon: Send, path: "/mobile/scholar/forms" },
    { name: "ติดตาม", icon: Clock, path: "/mobile/scholar/tracking" },
    { name: "แจ้งเตือน", icon: Bell, path: "/mobile/scholar/inbox", badge: 2 },
    { name: "โปรไฟล์", icon: User, path: "/mobile/scholar/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-['Inter','K2D',sans-serif] p-0 sm:p-4">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Device Frame */}
      {/* Note: transform-gpu creates a new containing block for fixed elements in some browsers, 
          but we will use absolute positioning for modals to ensure they stay inside the frame. */}
      <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-[#f8fafc] sm:rounded-[24px] overflow-hidden sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative sm:border-[6px] sm:border-slate-900 flex flex-col transform-gpu">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[70px] hide-scrollbar">
          <Outlet />
        </main>

        {/* Bottom Navigation - Native iOS Style */}
        <nav className="bg-white/95 backdrop-blur-xl border-t border-slate-200/80 absolute bottom-0 w-full px-2 pt-2 pb-5 flex justify-between items-center z-20">
          {navItems.map((item) => {
            const isActive = item.path === "/mobile/scholar" 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
              
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              >
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300",
                  isActive ? "bg-blue-50/80 text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}>
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={cn("transition-transform duration-300", isActive ? "scale-105" : "scale-100")} 
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-0.5 w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-black/5">{item.badge}</span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] transition-colors duration-300",
                  isActive ? "text-blue-700 font-bold tracking-tight" : "text-slate-500 font-medium"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

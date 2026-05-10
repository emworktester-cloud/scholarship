import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Eye, EyeOff, Shield, Lock, X } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../lib/permissions';
import { cn } from '../ui/utils';

interface PagePermission {
  permission?: Permission;
  label: string;
  description: string;
  uiLocation: string;
}

interface PermissionPanelProps {
  pageName: string;
  moduleName: string;
  permissions: PagePermission[];
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * PermissionPanel (Floating Widget) - แสดงสิทธิ์ทั้งหมดในหน้านั้นๆ
 * ถูกออกแบบใหม่ให้เป็นปุ่มลอย (FAB) มุมขวาล่าง เพื่อไม่เกะกะพื้นที่หน้าจอหลัก
 */
export function PermissionPanel({
  pageName,
  moduleName,
  permissions,
  className,
  defaultExpanded = false,
}: PermissionPanelProps) {
  const { can, roleName } = usePermissions();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // แยกสิทธิ์ที่มีและไม่มี
  const grantedPermissions = permissions.filter(p => !p.permission || can(p.permission));
  const lockedPermissions = permissions.filter(p => p.permission && !can(p.permission));

  return (
    <div className={cn("fixed bottom-6 right-6 z-[999]", className)}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-80 bg-white/95 backdrop-blur-md rounded-xl border border-purple-100 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-4 h-4" />
                <h3 className="text-sm font-semibold">สิทธิ์ของคุณ</h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{roleName}</span>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 space-y-4">
              {/* Page Info */}
              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                <p className="font-semibold text-purple-900 text-xs">{pageName}</p>
                <p className="text-[10px] text-purple-600 mt-0.5">Module: {moduleName}</p>
              </div>

              {/* Granted Permissions */}
              {grantedPermissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <h4 className="text-xs font-semibold text-emerald-700">อนุญาต ({grantedPermissions.length})</h4>
                  </div>
                  <div className="space-y-1.5">
                    {grantedPermissions.map((perm, index) => (
                      <div key={index} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-emerald-100 shadow-sm">
                        <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Eye className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[11px] text-gray-800 leading-tight">{perm.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug truncate">{perm.description}</p>
                          <p className="text-[9px] text-gray-400 mt-1 font-mono bg-gray-50 px-1 py-0.5 rounded inline-block">UI: {perm.uiLocation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Permissions */}
              {lockedPermissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 px-1 mt-4">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <h4 className="text-xs font-semibold text-gray-500">จำกัดสิทธิ์ ({lockedPermissions.length})</h4>
                  </div>
                  <div className="space-y-1.5">
                    {lockedPermissions.map((perm, index) => (
                      <div key={index} className="flex items-start gap-2.5 p-2 bg-gray-50/50 rounded-lg border border-gray-100 opacity-75">
                        <div className="w-5 h-5 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <EyeOff className="w-3 h-3 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[11px] text-gray-600 leading-tight">{perm.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug truncate">{perm.description}</p>
                          <p className="text-[9px] text-gray-400 mt-1 font-mono bg-white px-1 py-0.5 rounded inline-block border border-gray-100">UI: {perm.uiLocation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 transition-all z-50",
          isExpanded 
            ? "bg-purple-700 text-white" 
            : "bg-white text-purple-600 border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/30"
        )}
      >
        {isExpanded ? <X className="w-5 h-5" /> : <Shield className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}


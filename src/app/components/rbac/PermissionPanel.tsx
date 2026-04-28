import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Eye, EyeOff, Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission, PERMISSIONS } from '../../lib/permissions';
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
 * PermissionPanel - แสดงสิทธิ์ทั้งหมดในหน้านั้นๆ
 * 
 * Usage:
 * <PermissionPanel
 *   pageName="Dashboard ผู้บริหาร"
 *   moduleName="dashboard"
 *   permissions={[
 *     { permission: 'reports:view', label: 'ดู Dashboard', description: 'Dashboard ภาพรวมระดับผู้บริหาร', uiLocation: 'หน้า Dashboard หลัก' },
 *     { permission: 'reports:export', label: 'ส่งออกรายงาน', description: 'อนุมัติแผนโครงการ', uiLocation: 'ปุ่ม "อนุมัติ"' },
 *   ]}
 * />
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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-lg border border-purple-200 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              สิทธิ์การใช้งานของคุณในหน้านี้
              <span className="text-xs font-normal text-purple-600">({roleName})</span>
            </h3>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-purple-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-purple-600" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Page Info */}
              <div className="flex items-start gap-2 text-sm">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">ℹ️</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{pageName}</p>
                  <p className="text-xs text-gray-600">Module: {moduleName}</p>
                </div>
              </div>

              {/* Granted Permissions */}
              {grantedPermissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-700">
                      ฟังก์ชันที่คุณมีสิทธิ์ ({grantedPermissions.length} ฟังก์ชัน)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {grantedPermissions.map((perm, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center flex-shrink-0">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-green-700 px-1.5 py-0.5 bg-green-100 rounded">
                              ดู
                            </span>
                            <p className="font-semibold text-sm text-gray-900">{perm.label}</p>
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{perm.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ตำแหน่ง UI: <span className="font-mono">{perm.uiLocation}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Permissions */}
              {lockedPermissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-600">
                      ฟังก์ชันที่ถูกล็อค ({lockedPermissions.length} ฟังก์ชัน)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {lockedPermissions.map((perm, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (grantedPermissions.length + index) * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60"
                      >
                        <div className="w-6 h-6 rounded bg-gray-400 flex items-center justify-center flex-shrink-0">
                          <EyeOff className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-600 px-1.5 py-0.5 bg-gray-200 rounded">
                              อนุมัติ
                            </span>
                            <p className="font-semibold text-sm text-gray-700">{perm.label}</p>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{perm.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ตำแหน่ง UI: <span className="font-mono">{perm.uiLocation}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

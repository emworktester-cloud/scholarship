// Permission definitions for the scholarship management system

export const PERMISSIONS = {
  // Applications
  'applications:view': 'ดูรายการใบสมัคร',
  'applications:create': 'สร้างใบสมัครใหม่',
  'applications:edit': 'แก้ไขใบสมัคร',
  'applications:delete': 'ลบใบสมัคร',
  'applications:assign': 'มอบหมายงาน',
  'applications:check-documents': 'ตรวจเอกสาร',
  'applications:request-info': 'ขอข้อมูลเพิ่ม',
  
  // Review & Approval
  'review:view': 'ดูข้อมูลการพิจารณา',
  'review:submit': 'ส่งผลการพิจารณา',
  'review:edit': 'แก้ไขผลการพิจารณา',
  'approval:view': 'ดูข้อมูลการอนุมัติ',
  'approval:approve': 'อนุมัติทุน',
  'approval:reject': 'ปฏิเสธทุน',
  'approval:delegate': 'มอบหมายให้ผู้อื่นอนุมัติ',
  
  // Awards & Contracts
  'awards:view': 'ดูข้อมูลทุน',
  'awards:create': 'สร้างทุนใหม่',
  'awards:edit': 'แก้ไขข้อมูลทุน',
  'awards:suspend': 'ระงับทุน',
  'awards:terminate': 'ยกเลิกทุน',
  'contracts:view': 'ดูสัญญา',
  'contracts:generate': 'สร้างสัญญา',
  'contracts:sign': 'ลงนามสัญญา',
  
  // Payment
  'payment:view': 'ดูข้อมูลการจ่ายเงิน',
  'payment:create-plan': 'สร้างแผนจ่ายเงิน',
  'payment:approve': 'อนุมัติการจ่ายเงิน',
  'payment:execute': 'ดำเนินการจ่ายเงิน',
  'payment:cancel': 'ยกเลิกการจ่ายเงิน',
  
  // Tracking
  'tracking:view': 'ดูข้อมูลการติดตาม',
  'tracking:review': 'ตรวจรายงานผล',
  'tracking:request-revision': 'ขอแก้ไขรายงาน',
  'tracking:approve': 'อนุมัติรายงานผล',
  
  // Reports
  'reports:view': 'ดูรายงาน',
  'reports:export': 'ส่งออกรายงาน',
  'reports:create-template': 'สร้างรูปแบบรายงาน',
  'reports:schedule': 'กำหนดเวลารายงานอัตโนมัติ',
  
  // System Administration
  'users:view': 'ดูรายชื่อผู้ใช้',
  'users:create': 'สร้างผู้ใช้ให���่',
  'users:edit': 'แก้ไขข้อมูลผู้ใช้',
  'users:delete': 'ลบผู้ใช้',
  'users:reset-password': 'รีเซ็ตรหัสผ่าน',
  
  'roles:view': 'ดูบทบาท (Roles)',
  'roles:create': 'สร้างบทบาทใหม่',
  'roles:edit': 'แก้ไขบทบาท',
  'roles:delete': 'ลบบทบาท',
  'roles:assign': 'กำหนดบทบาทให้ผู้ใช้',
  
  'permissions:view': 'ดูสิทธิ์ (Permissions)',
  'permissions:assign': 'กำหนดสิทธิ์',
  
  'audit:view': 'ดู Audit Logs',
  'audit:export': 'ส่งออก Audit Logs',
  
  'security:view': 'ดูการตั้งค่าความปลอดภัย',
  'security:edit': 'แก้ไขการตั้งค่าความปลอดภัย',
  
  'api:view': 'ดูการตั้งค่า API',
  'api:manage': 'จัดการ API Keys',
  
  'masterdata:view': 'ดู Master Data',
  'masterdata:edit': 'แก้ไข Master Data',
  
  'workflow:view': 'ดู Workflows',
  'workflow:create': 'สร้าง Workflow',
  'workflow:edit': 'แก้ไข Workflow',
  'workflow:delete': 'ลบ Workflow',
  
  'forms:view': 'ดูฟอร์ม',
  'forms:create': 'สร้างฟอร์ม',
  'forms:edit': 'แก้ไขฟอร์ม',
  'forms:delete': 'ลบฟอร์ม',
  
  'notifications:view': 'ดู Notification Templates',
  'notifications:edit': 'แก้ไข Notification Templates',
  'notifications:send': 'ส่งการแจ้งเตือน',
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Role definitions with their permissions
export const ROLES = {
  'super-admin': {
    name: 'Super Admin',
    nameLocal: 'ผู้ดูแลระบบสูงสุด',
    description: 'สิทธิ์เต็มทุกอย่างในระบบ',
    color: 'red',
    permissions: Object.keys(PERMISSIONS) as Permission[],
  },
  'admin': {
    name: 'Admin',
    nameLocal: 'ผู้ดูแลระบบ',
    description: 'จัดการผู้ใช้ ตั้งค่าระบบ แต่ไม่สามารถเข้าถึงการตั้งค่าความปลอดภัยระดับสูง',
    color: 'orange',
    permissions: [
      'applications:view',
      'applications:edit',
      'applications:assign',
      'awards:view',
      'awards:edit',
      'payment:view',
      'tracking:view',
      'reports:view',
      'reports:export',
      'users:view',
      'users:create',
      'users:edit',
      'users:reset-password',
      'roles:view',
      'roles:assign',
      'permissions:view',
      'audit:view',
      'masterdata:view',
      'masterdata:edit',
      'workflow:view',
      'workflow:edit',
      'forms:view',
      'forms:edit',
      'notifications:view',
      'notifications:edit',
    ] as Permission[],
  },
  'approver': {
    name: 'Approver',
    nameLocal: 'ผู้อนุมัติ',
    description: 'อนุมัติ/ปฏิเสธทุน พิจารณาใบสมัคร',
    color: 'purple',
    permissions: [
      'applications:view',
      'review:view',
      'review:submit',
      'review:edit',
      'approval:view',
      'approval:approve',
      'approval:reject',
      'approval:delegate',
      'awards:view',
      'payment:view',
      'tracking:view',
      'reports:view',
      'reports:export',
    ] as Permission[],
  },
  'reviewer': {
    name: 'Reviewer',
    nameLocal: 'ผู้พิจารณา',
    description: 'พิจารณาใบสมัคร ให้คะแนน แต่ไม่สามารถอนุมัติได้',
    color: 'blue',
    permissions: [
      'applications:view',
      'review:view',
      'review:submit',
      'awards:view',
      'reports:view',
    ] as Permission[],
  },
  'staff': {
    name: 'Staff',
    nameLocal: 'เจ้าหน้าที่ทุน',
    description: 'ดูแลใบสมัคร ตรวจเอกสาร สร้างทุน จัดการการจ่ายเงิน',
    color: 'green',
    permissions: [
      'applications:view',
      'applications:create',
      'applications:edit',
      'applications:assign',
      'applications:check-documents',
      'applications:request-info',
      'review:view',
      'awards:view',
      'awards:create',
      'awards:edit',
      'contracts:view',
      'contracts:generate',
      'payment:view',
      'payment:create-plan',
      'tracking:view',
      'tracking:review',
      'tracking:request-revision',
      'tracking:approve',
      'reports:view',
      'reports:export',
    ] as Permission[],
  },
  'finance': {
    name: 'Finance',
    nameLocal: 'เจ้าหน้าที่การเงิน',
    description: 'จัดการการจ่ายเงิน อนุมัติการเบิกจ่าย',
    color: 'cyan',
    permissions: [
      'applications:view',
      'awards:view',
      'payment:view',
      'payment:create-plan',
      'payment:approve',
      'payment:execute',
      'payment:cancel',
      'reports:view',
      'reports:export',
    ] as Permission[],
  },
  'viewer': {
    name: 'Viewer',
    nameLocal: 'ผู้ดูข้อมูล',
    description: 'ดูข้อมูลได้อย่างเดียว ไม่สามารถแก้ไข',
    color: 'gray',
    permissions: [
      'applications:view',
      'review:view',
      'awards:view',
      'payment:view',
      'tracking:view',
      'reports:view',
    ] as Permission[],
  },
  'oea': {
    name: 'OEA Officer',
    nameLocal: 'เจ้าหน้าที่ สนร.',
    description: 'เจ้าหน้าที่ดูแลนักเรียนทุนในต่างประเทศ สามารถพิจารณาคำขอและอนุมัติ',
    color: 'amber',
    permissions: [
      'applications:view',
      'applications:check-documents',
      'applications:request-info',
      'review:view',
      'review:submit',
      'approval:view',
      'approval:approve',
      'approval:reject',
      'awards:view',
      'payment:view',
      'tracking:view',
      'reports:view',
    ] as Permission[],
  },
} as const;

export type RoleId = keyof typeof ROLES;

// Permission categories for organization
export const PERMISSION_CATEGORIES = {
  'applications': {
    name: 'การจัดการใบสมัคร',
    icon: 'FileText',
    color: 'blue',
  },
  'review': {
    name: 'การพิจารณา',
    icon: 'ClipboardCheck',
    color: 'purple',
  },
  'approval': {
    name: 'การอนุมัติ',
    icon: 'BadgeCheck',
    color: 'green',
  },
  'awards': {
    name: 'ทุน/สัญญา',
    icon: 'Award',
    color: 'yellow',
  },
  'contracts': {
    name: 'สัญญา',
    icon: 'FileSignature',
    color: 'orange',
  },
  'payment': {
    name: 'การจ่ายเงิน',
    icon: 'DollarSign',
    color: 'green',
  },
  'tracking': {
    name: 'การติดตามผล',
    icon: 'TrendingUp',
    color: 'cyan',
  },
  'reports': {
    name: 'รายงาน',
    icon: 'BarChart3',
    color: 'blue',
  },
  'users': {
    name: 'ผู้ใช้งาน',
    icon: 'Users',
    color: 'purple',
  },
  'roles': {
    name: 'บทบาท',
    icon: 'Shield',
    color: 'red',
  },
  'permissions': {
    name: 'สิทธิ์การใช้งาน',
    icon: 'Key',
    color: 'orange',
  },
  'audit': {
    name: 'Audit Logs',
    icon: 'History',
    color: 'gray',
  },
  'security': {
    name: 'ความปลอดภัย',
    icon: 'Lock',
    color: 'red',
  },
  'api': {
    name: 'API Management',
    icon: 'Code',
    color: 'blue',
  },
  'masterdata': {
    name: 'Master Data',
    icon: 'Database',
    color: 'green',
  },
  'workflow': {
    name: 'Workflows',
    icon: 'GitBranch',
    color: 'purple',
  },
  'forms': {
    name: 'Forms',
    icon: 'FormInput',
    color: 'cyan',
  },
  'notifications': {
    name: 'Notifications',
    icon: 'Bell',
    color: 'yellow',
  },
} as const;

// Helper to get permission category
export function getPermissionCategory(permission: Permission): keyof typeof PERMISSION_CATEGORIES {
  const category = permission.split(':')[0] as keyof typeof PERMISSION_CATEGORIES;
  return category;
}

// Helper to check if user has permission
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}

// Helper to check if user has any of the permissions
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(p => userPermissions.includes(p));
}

// Helper to check if user has all permissions
export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(p => userPermissions.includes(p));
}

// Get permissions by category
export function getPermissionsByCategory(permissions: Permission[]): Record<string, Permission[]> {
  const grouped: Record<string, Permission[]> = {};
  
  permissions.forEach(permission => {
    const category = getPermissionCategory(permission);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(permission);
  });
  
  return grouped;
}

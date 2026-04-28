import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

export type StatusType =
  | 'draft'
  | 'pending'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'suspended'
  | 'completed'
  | 'overdue';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; className: string }
> = {
  draft: {
    label: 'บันทึกฉบับร่าง',
    className: 'bg-[#64748b] hover:bg-[#64748b]/90 text-white',
  },
  pending: {
    label: 'รอพิจารณา',
    className: 'bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-white',
  },
  review: {
    label: 'อยู่ระหว่างตรวจสอบ',
    className: 'bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white',
  },
  approved: {
    label: 'อนุมัติแล้ว',
    className: 'bg-[#10b981] hover:bg-[#10b981]/90 text-white',
  },
  rejected: {
    label: 'ไม่อนุมัติ',
    className: 'bg-[#ef4444] hover:bg-[#ef4444]/90 text-white',
  },
  active: {
    label: 'กำลังดำเนินการ',
    className: 'bg-[#10b981] hover:bg-[#10b981]/90 text-white',
  },
  suspended: {
    label: 'ระงับการให้ทุน',
    className: 'bg-[#ef4444] hover:bg-[#ef4444]/90 text-white',
  },
  completed: {
    label: 'ปิดทุนแล้ว',
    className: 'bg-[#64748b] hover:bg-[#64748b]/90 text-white',
  },
  overdue: {
    label: 'เกินกำหนด',
    className: 'bg-[#ef4444] hover:bg-[#ef4444]/90 text-white animate-pulse',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn('font-medium', config.className)}>
      {label || config.label}
    </Badge>
  );
}

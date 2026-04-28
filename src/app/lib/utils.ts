// Utility function to merge Tailwind classes
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date in Thai format
export function formatThaiDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.getMonth() + 1;
  const year = d.getFullYear() + 543; // Convert to Buddhist Era

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return `${day} ${monthNames[month - 1]} ${year}`;
}

// Format date time in Thai format
export function formatThaiDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${formatThaiDate(d)} เวลา ${hours}:${minutes} น.`;
}

// Format number with Thai comma separator
export function formatThaiNumber(num: number): string {
  return num.toLocaleString('th-TH');
}

// Format currency in Thai Baht
export function formatThaiCurrency(amount: number): string {
  return `฿${formatThaiNumber(amount)}`;
}

// Get status badge color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'รออนุมัติ': 'bg-warning-100 text-warning-700 border-warning-300',
    'อนุมัติ': 'bg-success-100 text-success-700 border-success-300',
    'ไม่อนุมัติ': 'bg-error-100 text-error-700 border-error-300',
    'ดำเนินการ': 'bg-primary-100 text-primary-700 border-primary-300',
    'เสร็จสิ้น': 'bg-gray-100 text-gray-700 border-gray-300',
    'ยกเลิก': 'bg-gray-200 text-gray-600 border-gray-400',
    'ร่าง': 'bg-secondary-100 text-secondary-700 border-secondary-300',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

// Get priority badge color
export function getPriorityColor(priority: string): string {
  const priorityMap: Record<string, string> = {
    'สูง': 'bg-error-100 text-error-700 border-error-300',
    'กลาง': 'bg-warning-100 text-warning-700 border-warning-300',
    'ต่ำ': 'bg-success-100 text-success-700 border-success-300',
  };
  return priorityMap[priority] || 'bg-gray-100 text-gray-700 border-gray-300';
}

// Generate mock data helper
export function generateMockId(): string {
  return `ID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Delay helper for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

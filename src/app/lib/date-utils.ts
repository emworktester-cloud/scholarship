/**
 * Date utility functions for Buddhist Era (พ.ศ.) formatting.
 * Standard format: DD/MM/YYYY where YYYY is Buddhist Era year (CE + 543).
 */

/**
 * Convert a Thai short-month date string (e.g. "15 มิ.ย. 2540") to DD/MM/YYYY (พ.ศ.)
 * Also handles ISO format "YYYY-MM-DD" (CE) → DD/MM/YYYY (พ.ศ.)
 */
const thaiMonthMap: Record<string, string> = {
  'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
  'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
  'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12',
};

/**
 * Format a date string to DD/MM/YYYY (พ.ศ.)
 * 
 * Supported input formats:
 * - Thai short: "15 มิ.ย. 2540" 
 * - ISO CE: "2026-08-01"
 * - Already formatted: "15/06/2540" (passes through)
 * 
 * @returns DD/MM/YYYY in Buddhist Era
 */
export function formatDateBE(dateStr: string): string {
  if (!dateStr || dateStr === '-') return '-';

  // Already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;

  // ISO format: YYYY-MM-DD (CE year)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, yearCE, month, day] = isoMatch;
    const yearBE = parseInt(yearCE) + 543;
    return `${day}/${month}/${yearBE}`;
  }

  // Thai short-month format: "15 มิ.ย. 2540"
  const thaiMatch = dateStr.match(/^(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s+(\d{4})$/);
  if (thaiMatch) {
    const [, day, thaiMonth, year] = thaiMatch;
    const month = thaiMonthMap[thaiMonth] || '01';
    return `${day.padStart(2, '0')}/${month}/${year}`;
  }

  // Thai short-month with time: "25 เม.ย. 2569 10:30"
  const thaiTimeMatch = dateStr.match(/^(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s+(\d{4})\s+(\d{2}:\d{2})$/);
  if (thaiTimeMatch) {
    const [, day, thaiMonth, year, time] = thaiTimeMatch;
    const month = thaiMonthMap[thaiMonth] || '01';
    return `${day.padStart(2, '0')}/${month}/${year} ${time}`;
  }

  // Fallback: return as-is
  return dateStr;
}

/**
 * Convert an ISO date (CE year) to DD/MM/YYYY (พ.ศ.)
 * e.g. "2026-08-01" → "01/08/2569"
 */
export function isoToBE(isoDate: string): string {
  if (!isoDate) return '-';
  const [yearCE, month, day] = isoDate.split('-');
  if (!yearCE || !month || !day) return isoDate;
  const yearBE = parseInt(yearCE) + 543;
  return `${day}/${month}/${yearBE}`;
}

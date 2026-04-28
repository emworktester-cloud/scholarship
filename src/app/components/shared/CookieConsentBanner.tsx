import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cookie, Shield, BarChart3, Settings, ChevronDown, ChevronUp,
  CheckCircle, X, ExternalLink, Info,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useCookieConsent, type CookiePreferences } from '../../contexts/CookieConsentContext';

interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  nameEn: string;
  description: string;
  examples: string[];
  required: boolean;
  icon: typeof Cookie;
  color: string;
  retention: string;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'คุกกี้ที่จำเป็น',
    nameEn: 'Strictly Necessary',
    description: 'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น การจัดการ Session, การยืนยันตัวตน, ความปลอดภัย และไม่สามารถปิดใช้งานได้',
    examples: ['Session ID', 'CSRF Token', 'Authentication Token', 'Cookie Consent Preference'],
    required: true,
    icon: Shield,
    color: 'text-blue-600',
    retention: 'Session / 24 ชั่วโมง',
  },
  {
    id: 'analytics',
    name: 'คุกกี้เพื่อการวิเคราะห์',
    nameEn: 'Analytics',
    description: 'คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เข้าชมมีปฏิสัมพันธ์กับเว็บไซต์อย่างไร โดยรวบรวมและรายงานข้อมูลโดยไม่ระบุตัวตน เพื่อปรับปรุงประสิทธิภาพ',
    examples: ['จำนวนผู้เข้าชม', 'หน้าที่เข้าชมบ่อย', 'ระยะเวลาใช้งาน', 'อุปกรณ์ที่ใช้'],
    required: false,
    icon: BarChart3,
    color: 'text-green-600',
    retention: '1 ปี',
  },
  {
    id: 'functional',
    name: 'คุกกี้เพื่อการใช้งาน',
    nameEn: 'Functional',
    description: 'คุกกี้เหล่านี้ช่วยจดจำการตั้งค่าของผู้ใช้ เช่น ภาษา รูปแบบการแสดงผล ธีม เพื่อให้การใช้งานที่สะดวกยิ่งขึ้น',
    examples: ['การตั้งค่าภาษา', 'รูปแบบวันที่ พ.ศ./ค.ศ.', 'ธีมสี', 'มุมมอง Grid/List'],
    required: false,
    icon: Settings,
    color: 'text-purple-600',
    retention: '6 เดือน',
  },
  {
    id: 'marketing',
    name: 'คุกกี้เพื่อการตลาด',
    nameEn: 'Marketing',
    description: 'คุกกี้เหล่านี้ใช้ติดตามผู้เข้าชมข้ามเว็บไซต์ เพื่อแสดงข่าวสารหรือประชาสัมพันธ์ที่เกี่ยวข้อง (ไม่ใช้ในระบบ Back-office ปัจจุบัน)',
    examples: ['ไม่มีการใช้งานในปัจจุบัน'],
    required: false,
    icon: Cookie,
    color: 'text-amber-600',
    retention: 'ไม่ใช้งาน',
  },
];

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectOptional, saveCustom, setShowPreferences } = useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [customPrefs, setCustomPrefs] = useState<Partial<CookiePreferences>>({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[9999]"
      >
        <div className="mx-auto max-w-5xl px-4 pb-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">แจ้งเตือนการใช้คุกกี้</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ คุกกี้บางประเภทจำเป็นต่อการทำงานของระบบ
                    ในขณะที่คุกกี้อื่นๆ ช่วยให้เราปรับปรุงระบบให้ดียิ่งขึ้น คุณสามารถเลือกยินยอมก่อนเริ่มเก็บข้อมูลได้
                    ตาม <button className="text-blue-600 hover:underline inline-flex items-center gap-0.5" onClick={() => setShowPreferences(true)}>นโยบายการใช้คุกกี้ <ExternalLink className="w-3 h-3" /></button> และ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </p>
                </div>
              </div>
            </div>

            {/* Expandable Cookie Details */}
            <div className="px-5 pt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดและตั้งค่าคุกกี้'}
              </button>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pt-3 pb-1 space-y-2.5">
                    {cookieCategories.map((cat) => {
                      const CatIcon = cat.icon;
                      const isEnabled = cat.required || !!customPrefs[cat.id];
                      return (
                        <div
                          key={cat.id}
                          className={`p-3 border rounded-xl transition-all ${isEnabled ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <CatIcon className={`w-4 h-4 ${cat.color}`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold">{cat.name}</span>
                                  <Badge variant="outline" className="text-[8px]">{cat.nameEn}</Badge>
                                  {cat.required && <Badge className="bg-blue-100 text-blue-700 text-[8px] border border-blue-200">จำเป็น</Badge>}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5 max-w-lg">{cat.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => {
                                if (!cat.required) {
                                  setCustomPrefs(prev => ({ ...prev, [cat.id]: checked }));
                                }
                              }}
                              disabled={cat.required}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[9px] text-gray-400">
                            <span>ตัวอย่าง: {cat.examples.join(', ')}</span>
                            <span>•</span>
                            <span>ระยะเก็บ: {cat.retention}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="p-5 pt-3">
              <Separator className="mb-3" />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400 max-w-xs">
                  การยินยอมจะถูกบันทึกตาม PDPA มาตรา 19 คุณสามารถแก้ไขหรือถอนความยินยอมได้ตลอดเวลา
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={rejectOptional}>
                    ปฏิเสธคุกกี้เสริม
                  </Button>
                  {expanded && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveCustom(customPrefs)}
                    >
                      <Settings className="w-3.5 h-3.5 mr-1" />
                      บันทึกการตั้งค่า
                    </Button>
                  )}
                  <Button size="sm" onClick={acceptAll}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    ยอมรับทั้งหมด
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export { cookieCategories };

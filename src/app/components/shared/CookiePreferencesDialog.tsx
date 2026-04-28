import { useState } from 'react';
import {
  Cookie, Shield, BarChart3, Settings, CheckCircle, AlertTriangle,
  ExternalLink, Info, History,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useCookieConsent, type CookiePreferences } from '../../contexts/CookieConsentContext';
import { cookieCategories } from './CookieConsentBanner';
import { toast } from 'sonner';

export function CookiePreferencesDialog() {
  const {
    showPreferences, setShowPreferences,
    preferences, consentHistory,
    acceptAll, rejectOptional, saveCustom, withdrawConsent,
  } = useCookieConsent();

  const [customPrefs, setCustomPrefs] = useState<CookiePreferences>(preferences);
  const [activeTab, setActiveTab] = useState('preferences');

  // Sync prefs when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) setCustomPrefs(preferences);
    setShowPreferences(open);
  };

  return (
    <Dialog open={showPreferences} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[85vh]">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <DialogTitle className="text-white text-lg flex items-center gap-2">
            <Cookie className="w-5 h-5" />
            การจัดการคุกกี้และความยินยอม
          </DialogTitle>
          <DialogDescription className="text-blue-100 mt-1">
            ตั้งค่าความยินยอมการใช้คุกกี้ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </DialogDescription>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="preferences" className="flex-1"><Settings className="w-3.5 h-3.5 mr-1" />ตั้งค่าคุกกี้</TabsTrigger>
              <TabsTrigger value="policy" className="flex-1"><Shield className="w-3.5 h-3.5 mr-1" />นโยบายคุกกี้</TabsTrigger>
              <TabsTrigger value="history" className="flex-1"><History className="w-3.5 h-3.5 mr-1" />ประวัติความยินยอม</TabsTrigger>
            </TabsList>
          </div>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="px-6 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {cookieCategories.map((cat) => {
              const CatIcon = cat.icon;
              const isEnabled = cat.required || !!customPrefs[cat.id];
              return (
                <div
                  key={cat.id}
                  className={`p-4 border rounded-xl transition-all ${isEnabled ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-white border flex items-center justify-center`}>
                        <CatIcon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{cat.name}</span>
                          <Badge variant="outline" className="text-[9px]">{cat.nameEn}</Badge>
                          {cat.required && <Badge className="bg-blue-100 text-blue-700 text-[9px] border border-blue-200">จำเป็น</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
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
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                    <span>คุกกี้: {cat.examples.join(', ')}</span>
                    <span className="text-right">ระยะเก็บรักษา: {cat.retention}</span>
                  </div>
                </div>
              );
            })}

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-orange-800">ถอนความยินยอม</p>
                  <p className="text-[10px] text-orange-700 mt-0.5">
                    คุณสามารถถอนความยินยอมทั้งหมดได้ โดยระบบจะลบคุกกี้เสริมทั้งหมด แต่คุกกี้ที่จำเป็นจะยังคงทำงานอยู่
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-orange-700 border-orange-300 hover:bg-orange-100" onClick={() => { withdrawConsent(); toast.info('ถอนความยินยอมเรียบร้อย'); }}>
                    ถอนความยินยอมทั้งหมด
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Policy Tab */}
          <TabsContent value="policy" className="px-6 py-4 max-h-[50vh] overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-base font-semibold text-gray-900 mb-3">นโยบายการใช้คุกกี้ (Cookie Policy)</h3>
              <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-1">เกี่ยวกับนโยบายนี้</p>
                  <p>ระบบบริหารจัดการทุนรัฐบาล สำนักงาน ก.พ. ใช้คุกกี้ (Cookies) และเทคโนโลยีที่คล้ายคลึง เพื่อรวบรวมข้อมูลการใช้งานเว็บไซต์ โดยปฏิบัติตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. คุกกี้คืออะไร</h4>
                  <p>คุกกี้คือไฟล์ข้อความขนาดเล็กที่จัดเก็บบนอุปกรณ์ของคุณเมื่อเข้าชมเว็บไซต์ คุกกี้ช่วยให้เว็บไซต์จดจำอุปกรณ์ของคุณและจัดเก็บข้อมูลบางอย่างเกี่ยวกับการตั้งค่าหรือการกระทำที่ผ่านมาของคุณ</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. ประเภทคุกกี้ที่ใช้</h4>
                  {cookieCategories.map((cat, i) => (
                    <div key={cat.id} className="mb-2 p-2.5 border rounded-lg">
                      <p className="font-medium">{i + 1}. {cat.name} ({cat.nameEn})</p>
                      <p className="text-gray-500 mt-0.5">{cat.description}</p>
                      <p className="text-gray-400 mt-0.5">ระยะเวลาจัดเก็บ: {cat.retention}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. คุณสมบัติความปลอดภัยของคุกกี้ (Security Flags)</h4>
                  <p className="mb-2">คุกกี้ที่ใช้ในการรักษาความปลอดภัย (Session Cookies) มีการตั้งค่าดังนี้:</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200 shrink-0 mt-0.5">HttpOnly</Badge><span>ป้องกันไม่ให้ JavaScript ภายนอกเข้าถึงคุกกี้ (ป้องกัน XSS Attack)</span></li>
                    <li className="flex items-start gap-2"><Badge className="bg-blue-100 text-blue-700 text-[9px] border border-blue-200 shrink-0 mt-0.5">Secure</Badge><span>บังคับส่งคุกกี้ผ่าน HTTPS (TLS 1.2 ขึ้นไป) เท่านั้น</span></li>
                    <li className="flex items-start gap-2"><Badge className="bg-purple-100 text-purple-700 text-[9px] border border-purple-200 shrink-0 mt-0.5">SameSite=Strict</Badge><span>ป้องกัน Cross-Site Request Forgery (CSRF) โดยส่งคุกกี้เฉพาะ Request จาก Origin เดียวกัน</span></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. สิทธิ์ของคุณ</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>เลือกยินยอมหรือปฏิเสธคุกกี้เสริมก่อนเริ่มเก็บข้อมูล</li>
                    <li>แก้ไขหรือยกเลิกความยินยอม (Withdraw Consent) ได้ตลอดเวลา ผ่านเมนู "ตั้งค่าคุกกี้"</li>
                    <li>ลบคุกกี้ทั้งหมดผ่านการตั้งค่าเบราว์เซอร์</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5. การบันทึกหลักฐาน (Consent Logging)</h4>
                  <p>ระบบบันทึกหลักฐานการให้ความยินยอมของผู้ใช้ทุกครั้ง ประกอบด้วย: วัน/เวลาที่ยินยอม, ประเภทความยินยอม, IP Address และ User Agent เพื่อใช้ตรวจสอบตามกฎหมาย PDPA</p>
                </div>

                <div className="p-3 bg-gray-50 border rounded-lg">
                  <p className="font-medium text-gray-800">ติดต่อ</p>
                  <p className="text-gray-500 mt-1">เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) สำนักงาน ก.พ.<br />อีเมล: dpo@ocsc.go.th<br />ปรับปรุงล่าสุด: 25 กุมภาพันธ์ 2569</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="px-6 py-4 max-h-[50vh] overflow-y-auto">
            <div className="space-y-3">
              <p className="text-xs text-gray-500">บันทึกประวัติการให้/แก้ไข/ถอนความยินยอม สำหรับตรวจสอบตามกฎหมาย PDPA</p>
              {consentHistory.length > 0 ? (
                consentHistory.slice().reverse().map((record, i) => {
                  const actionLabel: Record<string, { text: string; color: string }> = {
                    accepted_all: { text: 'ยอมรับทั้งหมด', color: 'bg-green-100 text-green-700' },
                    rejected_optional: { text: 'ปฏิเสธคุกกี้เสริม', color: 'bg-yellow-100 text-yellow-700' },
                    custom: { text: 'ตั้งค่าเอง', color: 'bg-blue-100 text-blue-700' },
                    withdrawn: { text: 'ถอนความยินยอม', color: 'bg-red-100 text-red-700' },
                  };
                  const al = actionLabel[record.action] || actionLabel.custom;
                  return (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={`text-[10px] ${al.color} border`}>{al.text}</Badge>
                        <span className="text-[10px] text-gray-400">{new Date(record.timestamp).toLocaleString('th-TH')}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-1.5">
                        {Object.entries(record.preferences).map(([key, val]) => (
                          <Badge key={key} variant="outline" className={`text-[9px] ${val ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                            {key}: {val ? '✓' : '✗'}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">IP: {record.ip}</p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">ยังไม่มีประวัติความยินยอม</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setShowPreferences(false)}>ปิด</Button>
          {activeTab === 'preferences' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={rejectOptional}>ปฏิเสธคุกกี้เสริม</Button>
              <Button size="sm" onClick={() => saveCustom(customPrefs)}><CheckCircle className="w-3.5 h-3.5 mr-1" />บันทึกการตั้งค่า</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

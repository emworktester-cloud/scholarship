import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Calculator, FolderOpen, Image, PenTool, Settings, Siren,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { PermissionPanel } from '../components/rbac/PermissionPanel';

import ScholarshipCalculator from './support/ScholarshipCalculator';
import DocumentManager from './support/DocumentManager';
import PhotoManager from './support/PhotoManager';
import ESignature from './support/ESignature';
import SystemConfig from './support/SystemConfig';
import SafetyAlerts from './support/SafetyAlerts';

export default function SupportTools() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/documents')) return 'documents';
    if (location.pathname.includes('/photos')) return 'photos';
    if (location.pathname.includes('/calculator')) return 'calculator';
    if (location.pathname.includes('/esignature')) return 'esignature';
    if (location.pathname.includes('/config')) return 'config';
    if (location.pathname.includes('/safety')) return 'safety';
    return 'documents';
  });

  useEffect(() => {
    if (location.pathname.includes('/documents')) setActiveTab('documents');
    else if (location.pathname.includes('/photos')) setActiveTab('photos');
    else if (location.pathname.includes('/calculator')) setActiveTab('calculator');
    else if (location.pathname.includes('/esignature')) setActiveTab('esignature');
    else if (location.pathname.includes('/config')) setActiveTab('config');
    else if (location.pathname.includes('/safety')) setActiveTab('safety');
  }, [location.pathname]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    navigate(`/scholar-hub/${val}`, { replace: true });
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="เครื่องมือสนับสนุน"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'เครื่องมือสนับสนุน' }]}
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="เครื่องมือสนับสนุน"
          moduleName="support-tools"
          defaultExpanded={false}
          permissions={[
            { permission: 'support:calculator', label: 'คำนวณวันรับทุน/ชดใช้ทุน', description: 'ใช้เครื่องคำนวณวันรับทุนและวันชดใช้ทุน', uiLocation: 'Tab "คำนวณวันทุน"' },
            { permission: 'support:documents', label: 'จัดการแฟ้มข้อมูล', description: 'อัปโหลด ดู ดาวน์โหลดเอกสารในแฟ้มนักเรียน', uiLocation: 'Tab "แฟ้มข้อมูล"' },
            { permission: 'support:photos', label: 'จัดการรูปถ่าย', description: 'นำเข้า ปรับขนาด ตัดกรอบรูปถ่ายนักเรียน', uiLocation: 'Tab "รูปถ่าย"' },
            { permission: 'support:esignature', label: 'จัดการลายเซ็น', description: 'นำเข้า แก้ไข จัดเก็บลายเซ็นอิเล็กทรอนิกส์', uiLocation: 'Tab "ลายเซ็น e-Signature"' },
            { permission: 'support:config', label: 'ตั้งค่าระบบ', description: 'กำหนดค่าเริ่มต้นและเปิดปิดโมดูล', uiLocation: 'Tab "ตั้งค่าระบบ"' },
            { permission: 'support:safety', label: 'แจ้งความปลอดภัย', description: 'ดูและตอบกลับการแจ้งเหตุฉุกเฉินจากนักเรียน', uiLocation: 'Tab "แจ้งความปลอดภัย"' },
          ]}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="calculator"><Calculator className="w-4 h-4 mr-1.5" />คำนวณวันทุน</TabsTrigger>
            <TabsTrigger value="documents"><FolderOpen className="w-4 h-4 mr-1.5" />แฟ้มข้อมูล</TabsTrigger>
            <TabsTrigger value="photos"><Image className="w-4 h-4 mr-1.5" />รูปถ่าย</TabsTrigger>
            <TabsTrigger value="esignature"><PenTool className="w-4 h-4 mr-1.5" />ลายเซ็น e-Signature</TabsTrigger>
            <TabsTrigger value="config"><Settings className="w-4 h-4 mr-1.5" />ตั้งค่าระบบ</TabsTrigger>
            <TabsTrigger value="safety"><Siren className="w-4 h-4 mr-1.5" />แจ้งความปลอดภัย<Badge className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5">1</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="calculator"><ScholarshipCalculator /></TabsContent>
          <TabsContent value="documents"><DocumentManager /></TabsContent>
          <TabsContent value="photos"><PhotoManager /></TabsContent>
          <TabsContent value="esignature"><ESignature /></TabsContent>
          <TabsContent value="config"><SystemConfig /></TabsContent>
          <TabsContent value="safety"><SafetyAlerts /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
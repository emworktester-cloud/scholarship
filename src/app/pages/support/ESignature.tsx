import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PenTool, Upload, Download, Trash2, Eye, Edit, Plus,
  CheckCircle, Clock, User, FileText, Shield, AlertTriangle,
  Search, Calendar, UserCheck, Stamp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Switch } from '../../components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

interface Signer {
  id: string;
  name: string;
  position: string;
  department: string;
  hasSignature: boolean;
  signatureDate: string;
  usedInForms: string[];
  status: 'active' | 'inactive' | 'expired';
  authorityLevel: string;
}

const signers: Signer[] = [
  { id: 'SIG-001', name: 'นายสุรพล ศรีสุข', position: 'เลขาธิการ ก.พ.', department: 'สำนักงาน ก.พ.', hasSignature: true, signatureDate: '01/01/2569', usedInForms: ['EF-01', 'EF-02', 'EF-05', 'EF-10'], status: 'active', authorityLevel: 'ระดับสูงสุด' },
  { id: 'SIG-002', name: 'นางวรรณา พิทักษ์', position: 'รองเลขาธิการ ก.พ.', department: 'สำนักงาน ก.พ.', hasSignature: true, signatureDate: '01/01/2569', usedInForms: ['EF-03', 'EF-04', 'EF-06'], status: 'active', authorityLevel: 'ระดับรอง' },
  { id: 'SIG-003', name: 'นายประสิทธิ์ ผู้ดูแล', position: 'ผู้อำนวยการกอง', department: 'กองทุนการศึกษา', hasSignature: true, signatureDate: '15/01/2569', usedInForms: ['EF-07', 'EF-08', 'EF-09'], status: 'active', authorityLevel: 'ระดับกอง' },
  { id: 'SIG-004', name: 'นางสาวรัตนา การเงิน', position: 'หัวหน้าฝ่ายการเงิน', department: 'ฝ่ายการเงิน', hasSignature: true, signatureDate: '01/02/2569', usedInForms: ['EF-11', 'EF-12', 'EF-13'], status: 'active', authorityLevel: 'ระดับฝ่าย' },
  { id: 'SIG-005', name: 'นายวิชัย อดีตอธิบดี', position: 'อดีตเลขาธิการ ก.พ.', department: 'สำนักงาน ก.พ.', hasSignature: true, signatureDate: '01/06/2567', usedInForms: [], status: 'expired', authorityLevel: 'ระดับสูงสุด (เดิม)' },
  { id: 'SIG-006', name: 'นายสมชาย ผู้จัดการ', position: 'หัวหน้างานทุน', department: 'งานทุนการศึกษา', hasSignature: false, signatureDate: '-', usedInForms: [], status: 'inactive', authorityLevel: 'ระดับงาน' },
];

const statusConfig = {
  active: { label: 'ใช้งาน', bg: 'bg-green-100', color: 'text-green-700', icon: CheckCircle },
  inactive: { label: 'ไม่ได้ใช้', bg: 'bg-gray-100', color: 'text-gray-600', icon: Clock },
  expired: { label: 'หมดอายุ', bg: 'bg-red-100', color: 'text-red-700', icon: AlertTriangle },
};

export default function ESignature() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSigner, setSelectedSigner] = useState<Signer | null>(null);

  const filtered = signers.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.position.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeCount = signers.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ลายเซ็นทั้งหมด', value: signers.length, icon: PenTool, bg: 'from-indigo-500 to-indigo-600', bgL: 'from-indigo-50 to-indigo-100' },
          { label: 'ใช้งานอยู่', value: activeCount, icon: CheckCircle, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
          { label: 'แบบฟอร์มที่ใช้', value: '13 ฟอร์ม', icon: FileText, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
          { label: 'หมดอายุ', value: signers.filter(s => s.status === 'expired').length, icon: AlertTriangle, bg: 'from-red-500 to-rose-500', bgL: 'from-red-50 to-rose-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div><div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div></div></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <Input placeholder="ค้นหาชื่อ/ตำแหน่ง..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64" />
        <Button onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-1.5" />เพิ่มลายเซ็น</Button>
      </div>

      {/* Signer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((signer, i) => {
          const sc = statusConfig[signer.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={signer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12"><AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">{signer.name.slice(0, 2)}</AvatarFallback></Avatar>
                      <div>
                        <h4 className="text-sm font-semibold">{signer.name}</h4>
                        <p className="text-xs text-gray-500">{signer.position}</p>
                        <p className="text-[10px] text-gray-400">{signer.department}</p>
                      </div>
                    </div>
                    <Badge className={`text-[10px] ${sc.bg} ${sc.color} border`}><StatusIcon className="w-3 h-3 mr-0.5" />{sc.label}</Badge>
                  </div>

                  {/* Signature Preview */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg h-20 mb-3 flex items-center justify-center bg-gray-50">
                    {signer.hasSignature ? (
                      <div className="text-center">
                        <PenTool className="w-6 h-6 text-indigo-400 mx-auto" />
                        <p className="text-[10px] text-gray-400 mt-1 italic">ลายเซ็น (ตัวอย่าง)</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">ยังไม่มีลายเซ็น</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{signer.authorityLevel}</span>
                    {signer.signatureDate !== '-' && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{signer.signatureDate}</span>}
                  </div>

                  {signer.usedInForms.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {signer.usedInForms.map(f => <Badge key={f} variant="outline" className="text-[9px] font-mono">{f}</Badge>)}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {signer.hasSignature ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelectedSigner(signer); setEditOpen(true); }}><Edit className="w-3.5 h-3.5 mr-1" />แก้ไข</Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info('ดูตัวอย่างลายเซ็น')}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success('ดาวน์โหลดลายเซ็น')}><Download className="w-3.5 h-3.5" /></Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1" onClick={() => { setSelectedSigner(signer); setAddOpen(true); }}><Upload className="w-3.5 h-3.5 mr-1" />นำเข้าลายเซ็น</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Signature Dialog */}
      <Dialog open={addOpen || editOpen} onOpenChange={(open) => { if (!open) { setAddOpen(false); setEditOpen(false); } }}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><PenTool className="w-5 h-5" />{editOpen ? 'แก้ไขลายเซ็น' : 'เพิ่มลายเซ็นอิเล็กทรอนิกส์'}</DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">นำเข้ารูปถ่ายลายเซ็นของผู้มีอำนาจสำหรับใช้ในแบบฟอร์ม ก.พ.</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>ชื่อ-นามสกุล <span className="text-red-500">*</span></Label><Input placeholder="ชื่อ-นามสกุล" defaultValue={selectedSigner?.name || ''} /></div>
              <div className="space-y-2"><Label>ตำแหน่ง <span className="text-red-500">*</span></Label><Input placeholder="ตำแหน่ง" defaultValue={selectedSigner?.position || ''} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>หน่วยงาน</Label><Input placeholder="หน่วยงาน" defaultValue={selectedSigner?.department || ''} /></div>
              <div className="space-y-2"><Label>ระดับอำนาจ</Label>
                <Select defaultValue={selectedSigner?.authorityLevel || ''}><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ระดับสูงสุด">ระดับสูงสุด (เลขาธิการ)</SelectItem><SelectItem value="ระดับรอง">ระดับรอง</SelectItem><SelectItem value="ระดับกอง">ระดับกอง</SelectItem><SelectItem value="ระดับฝ่าย">ระดับฝ่าย</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>รูปถ่ายลายเซ็น <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer" onClick={() => toast.info('เลือกรูปลายเซ็น...')}>
                <PenTool className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปลายเซ็น</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG (พื้นโปร่งใส) หรือ JPG | แนะนำ 600×200px</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>แบบฟอร์มที่ใช้</Label>
              <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto border rounded-lg p-2">
                {['EF-01', 'EF-02', 'EF-03', 'EF-04', 'EF-05', 'EF-06', 'EF-07', 'EF-08', 'EF-09', 'EF-10', 'EF-11', 'EF-12'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 p-1"><input type="checkbox" id={`form-${f}`} className="w-3.5 h-3.5" defaultChecked={selectedSigner?.usedInForms.includes(f)} /><Label htmlFor={`form-${f}`} className="text-[10px] font-mono font-normal cursor-pointer">{f}</Label></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setAddOpen(false); setEditOpen(false); }}>ยกเลิก</Button>
            <Button onClick={() => { setAddOpen(false); setEditOpen(false); toast.success('บันทึกลายเซ็นเรียบร้อย'); }}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

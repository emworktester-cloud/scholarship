import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Image, Upload, Crop, ZoomIn, ZoomOut, RotateCw,
  Download, Trash2, Search, User, CheckCircle, Eye,
  Maximize2, Minimize2, Grid, Camera, UserCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Slider } from '../../components/ui/slider';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

interface ScholarPhoto {
  id: string;
  scholarId: string;
  scholarName: string;
  hasPhoto: boolean;
  photoDate: string;
  size: string;
  dimensions: string;
}

const scholars: ScholarPhoto[] = [
  { id: 'P-001', scholarId: 'SCH-001', scholarName: 'น.ส.พรพิมล สุขใจ', hasPhoto: true, photoDate: '1 ส.ค. 2566', size: '450 KB', dimensions: '400×500' },
  { id: 'P-002', scholarId: 'SCH-002', scholarName: 'นายวิชัย สมบูรณ์', hasPhoto: true, photoDate: '15 ก.ย. 2565', size: '380 KB', dimensions: '400×500' },
  { id: 'P-003', scholarId: 'SCH-003', scholarName: 'น.ส.นภา รักเรียน', hasPhoto: false, photoDate: '-', size: '-', dimensions: '-' },
  { id: 'P-004', scholarId: 'SCH-004', scholarName: 'นายสมศักดิ์ มุ่งมั่น', hasPhoto: true, photoDate: '10 ต.ค. 2564', size: '520 KB', dimensions: '400×500' },
  { id: 'P-005', scholarId: 'SCH-005', scholarName: 'น.ส.วิไล สมหวัง', hasPhoto: true, photoDate: '20 ก.พ. 2565', size: '410 KB', dimensions: '400×500' },
  { id: 'P-006', scholarId: 'SCH-006', scholarName: 'นายกิตติ ปัญญาดี', hasPhoto: false, photoDate: '-', size: '-', dimensions: '-' },
  { id: 'P-007', scholarId: 'SCH-007', scholarName: 'น.ส.สุภาพร เก่งกาจ', hasPhoto: true, photoDate: '5 ก.ย. 2563', size: '390 KB', dimensions: '400×500' },
  { id: 'P-008', scholarId: 'SCH-008', scholarName: 'นายธนกฤต ประสบผล', hasPhoto: true, photoDate: '1 ต.ค. 2562', size: '480 KB', dimensions: '400×500' },
];

const resizePresets = [
  { label: 'โปรไฟล์ (400×500)', width: 400, height: 500 },
  { label: 'ขนาดเล็ก (200×250)', width: 200, height: 250 },
  { label: 'รูปถ่ายบัตร (300×400)', width: 300, height: 400 },
  { label: 'สี่เหลี่ยม (400×400)', width: 400, height: 400 },
];

export default function PhotoManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<ScholarPhoto | null>(null);
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [cropSize, setCropSize] = useState('400x500');

  const filtered = scholars.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.scholarName.toLowerCase().includes(q) || s.scholarId.toLowerCase().includes(q);
  });

  const withPhoto = scholars.filter(s => s.hasPhoto).length;
  const withoutPhoto = scholars.filter(s => !s.hasPhoto).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'นักเรียนทุนทั้งหมด', value: scholars.length, icon: User, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
          { label: 'มีรูปถ่าย', value: withPhoto, icon: CheckCircle, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
          { label: 'ยังไม่มีรูป', value: withoutPhoto, icon: Camera, bg: 'from-red-500 to-rose-500', bgL: 'from-red-50 to-rose-50' },
          { label: 'ครอบคลุม', value: `${Math.round((withPhoto / scholars.length) * 100)}%`, icon: Image, bg: 'from-purple-500 to-violet-500', bgL: 'from-purple-50 to-violet-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div><div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div></div></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <Input placeholder="ค้นหาชื่อ/รหัสนักเรียนทุน..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64" />
        <Button variant="outline" onClick={() => toast.info('นำเข้ารูปถ่ายเป็นชุด')}><Upload className="w-4 h-4 mr-1.5" />นำเข้าเป็นชุด</Button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((scholar, i) => (
          <motion.div key={scholar.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="relative mx-auto w-20 h-24 mb-3">
                  {scholar.hasPhoto ? (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                      <Avatar className="w-full h-full rounded-lg"><AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-lg">{scholar.scholarName.slice(0, 2)}</AvatarFallback></Avatar>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"><UserCircle className="w-10 h-10 text-gray-300" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      {scholar.hasPhoto ? (
                        <>
                          <Button size="sm" variant="secondary" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setSelectedScholar(scholar); setEditOpen(true); }}><Crop className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="secondary" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); toast.info('ดูตัวอย่าง'); }}><Eye className="w-3.5 h-3.5" /></Button>
                        </>
                      ) : (
                        <Button size="sm" variant="secondary" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); setSelectedScholar(scholar); setUploadOpen(true); }}><Upload className="w-3.5 h-3.5 mr-1" />เพิ่ม</Button>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium truncate">{scholar.scholarName}</p>
                <p className="text-[10px] text-gray-400 font-mono">{scholar.scholarId}</p>
                {scholar.hasPhoto ? (
                  <Badge className="bg-green-100 text-green-700 text-[9px] mt-1">มีรูป</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-500 text-[9px] mt-1">ไม่มีรูป</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit/Crop Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-violet-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Crop className="w-5 h-5" />ปรับแต่งรูปถ่าย — {selectedScholar?.scholarName}</DialogTitle>
            <DialogDescription className="text-purple-100 mt-1">ปรับขนาด (Resize) และตัดกรอบรูป (Crop) สำหรับโปรไฟล์</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-5">
            {/* Preview */}
            <div className="flex gap-6">
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl border min-h-[300px]">
                <div className="text-center" style={{ transform: `scale(${zoom[0] / 100}) rotate(${rotation}deg)`, transition: 'transform 0.2s' }}>
                  <Avatar className="w-40 h-48 mx-auto rounded-lg"><AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-3xl">{selectedScholar?.scholarName.slice(0, 2)}</AvatarFallback></Avatar>
                  <p className="text-[10px] text-gray-400 mt-2">ตัวอย่างรูปถ่าย</p>
                </div>
              </div>
              <div className="w-56 space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs">ขนาดรูป (Preset)</Label>
                  <Select value={cropSize} onValueChange={setCropSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{resizePresets.map(p => <SelectItem key={p.label} value={`${p.width}x${p.height}`}>{p.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><Label className="text-xs">ซูม</Label><span className="text-xs text-gray-500">{zoom[0]}%</span></div>
                  <div className="flex items-center gap-2"><ZoomOut className="w-4 h-4 text-gray-400" /><Slider value={zoom} onValueChange={setZoom} min={50} max={200} step={5} className="flex-1" /><ZoomIn className="w-4 h-4 text-gray-400" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">หมุน</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setRotation(r => r - 90)}><RotateCw className="w-3.5 h-3.5 mr-1 scale-x-[-1]" />ซ้าย</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setRotation(r => r + 90)}><RotateCw className="w-3.5 h-3.5 mr-1" />ขวา</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info('เปลี่ยนรูปถ่ายใหม่')}><Upload className="w-4 h-4 mr-1.5" />เปลี่ยนรูป</Button>
              </div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setEditOpen(false); toast.success('บันทึกรูปถ่ายเรียบร้อย'); }}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Camera className="w-5 h-5" />นำเข้ารูปถ่าย — {selectedScholar?.scholarName}</DialogTitle>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => toast.info('เลือกรูปถ่าย...')}>
              <Camera className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">คลิกเพื่อเลือกรูปถ่าย</p>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG (แนะนำ 400×500px ขึ้นไป)</p>
            </div>
            <div className="space-y-2"><Label className="text-xs">ขนาดสำหรับโปรไฟล์</Label>
              <Select defaultValue="400x500"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{resizePresets.map(p => <SelectItem key={p.label} value={`${p.width}x${p.height}`}>{p.label}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setUploadOpen(false); toast.success('อัปโหลดและปรับขนาดเรียบร้อย'); }}>อัปโหลดและบันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

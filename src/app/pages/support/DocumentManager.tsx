import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FolderOpen, FileText, Upload, Download, Search, Plus,
  Trash2, Eye, File, Image, FileSpreadsheet, FileClock,
  Folder, FolderPlus, ChevronRight, MoreVertical,
  Filter, Grid, List, Clock, User, Tag, Lock,
  CheckCircle, AlertTriangle, HardDrive,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';

interface ScholarFolder {
  id: string;
  scholarId: string;
  scholarName: string;
  totalFiles: number;
  totalSize: string;
  lastModified: string;
  categories: { name: string; count: number }[];
}

interface DocFile {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  version: number;
  status: 'verified' | 'pending' | 'expired';
}

const scholarFolders: ScholarFolder[] = [
  { id: 'F-001', scholarId: 'SCH-001', scholarName: 'น.ส.พรพิมล สุขใจ', totalFiles: 24, totalSize: '128 MB', lastModified: '25 ก.พ. 2569', categories: [{ name: 'สัญญา', count: 3 }, { name: 'ผลการเรียน', count: 8 }, { name: 'รายงาน', count: 6 }, { name: 'เบิกจ่าย', count: 5 }, { name: 'อื่นๆ', count: 2 }] },
  { id: 'F-002', scholarId: 'SCH-002', scholarName: 'นายวิชัย สมบูรณ์', totalFiles: 32, totalSize: '245 MB', lastModified: '24 ก.พ. 2569', categories: [{ name: 'สัญญา', count: 4 }, { name: 'ผลการเรียน', count: 12 }, { name: 'รายงาน', count: 8 }, { name: 'เบิกจ่าย', count: 6 }, { name: 'อื่นๆ', count: 2 }] },
  { id: 'F-003', scholarId: 'SCH-003', scholarName: 'น.ส.นภา รักเรียน', totalFiles: 12, totalSize: '65 MB', lastModified: '23 ก.พ. 2569', categories: [{ name: 'สัญญา', count: 2 }, { name: 'ผลการเรียน', count: 4 }, { name: 'รายงาน', count: 3 }, { name: 'เบิกจ่าย', count: 2 }, { name: 'อื่นๆ', count: 1 }] },
  { id: 'F-004', scholarId: 'SCH-004', scholarName: 'นายสมศักดิ์ มุ่งมั่น', totalFiles: 28, totalSize: '180 MB', lastModified: '22 ก.พ. 2569', categories: [{ name: 'สัญญา', count: 3 }, { name: 'ผลการเรียน', count: 10 }, { name: 'รายงาน', count: 7 }, { name: 'เบิกจ่าย', count: 5 }, { name: 'อื่นๆ', count: 3 }] },
];

const mockFiles: DocFile[] = [
  { id: 'DOC-001', name: 'สัญญารับทุน ก.พ. 2566.pdf', category: 'สัญญา', type: 'PDF', size: '2.3 MB', uploadedBy: 'นายประสิทธิ์ ผู้ดูแล', uploadedDate: '15 ส.ค. 2566', version: 1, status: 'verified' },
  { id: 'DOC-002', name: 'ผลการเรียน Semester 1-2568.pdf', category: 'ผลการเรียน', type: 'PDF', size: '1.1 MB', uploadedBy: 'น.ส.พรพิมล สุขใจ', uploadedDate: '20 ก.พ. 2569', version: 2, status: 'verified' },
  { id: 'DOC-003', name: 'รายงานความก้าวหน้า Q4-2568.docx', category: 'รายงาน', type: 'DOCX', size: '3.5 MB', uploadedBy: 'น.ส.พรพิมล สุขใจ', uploadedDate: '15 ม.ค. 2569', version: 1, status: 'verified' },
  { id: 'DOC-004', name: 'ใบเสร็จค่าเทอม Term 5.pdf', category: 'เบิกจ่าย', type: 'PDF', size: '0.8 MB', uploadedBy: 'น.ส.พรพิมล สุขใจ', uploadedDate: '10 ม.ค. 2569', version: 1, status: 'pending' },
  { id: 'DOC-005', name: 'หนังสือเดินทาง (สำเนา).jpg', category: 'อื่นๆ', type: 'JPG', size: '1.5 MB', uploadedBy: 'น.ส.พรพิมล สุขใจ', uploadedDate: '1 ส.ค. 2566', version: 1, status: 'expired' },
  { id: 'DOC-006', name: 'ใบรับรอง Enrollment Letter.pdf', category: 'ผลการเรียน', type: 'PDF', size: '0.5 MB', uploadedBy: 'น.ส.พรพิมล สุขใจ', uploadedDate: '5 ก.พ. 2569', version: 1, status: 'verified' },
];

const fileTypeIcon: Record<string, { icon: typeof FileText; color: string }> = {
  PDF: { icon: FileText, color: 'text-red-500' },
  DOCX: { icon: File, color: 'text-blue-500' },
  XLSX: { icon: FileSpreadsheet, color: 'text-green-500' },
  JPG: { icon: Image, color: 'text-purple-500' },
  PNG: { icon: Image, color: 'text-purple-500' },
};

const statusMap = {
  verified: { label: 'ยืนยันแล้ว', bg: 'bg-green-100', color: 'text-green-700', icon: CheckCircle },
  pending: { label: 'รอตรวจสอบ', bg: 'bg-yellow-100', color: 'text-yellow-700', icon: Clock },
  expired: { label: 'หมดอายุ', bg: 'bg-red-100', color: 'text-red-700', icon: AlertTriangle },
};

const categories = ['ทั้งหมด', 'สัญญา', 'ผลการเรียน', 'รายงาน', 'เบิกจ่าย', 'อื่นๆ'];

export default function DocumentManager() {
  const [selectedFolder, setSelectedFolder] = useState<ScholarFolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ทั้งหมด');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filteredFiles = mockFiles.filter(f => {
    if (categoryFilter !== 'ทั้งหมด' && f.category !== categoryFilter) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'แฟ้มข้อมูลทั้งหมด', value: `${scholarFolders.length} แฟ้ม`, icon: FolderOpen, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
          { label: 'ไฟล์ทั้งหมด', value: `${scholarFolders.reduce((a, b) => a + b.totalFiles, 0)} ไฟล์`, icon: FileText, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
          { label: 'พื้นที่ใช้งาน', value: '618 MB', icon: HardDrive, bg: 'from-purple-500 to-violet-500', bgL: 'from-purple-50 to-violet-50' },
          { label: 'อัปโหลดวันนี้', value: '8 ไฟล์', icon: Upload, bg: 'from-amber-500 to-orange-500', bgL: 'from-amber-50 to-orange-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                  <div><p className="text-lg font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {!selectedFolder ? (
        /* Folder List */
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2"><FolderOpen className="w-5 h-5 text-blue-600" />แฟ้มข้อมูลนักเรียนทุน</h3>
            <Input placeholder="ค้นหาชื่อ/รหัสนักเรียนทุน..." className="w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarFolders.map((folder, i) => (
              <motion.div key={folder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedFolder(folder)}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md"><Folder className="w-6 h-6 text-white" /></div>
                        <div><h4 className="font-semibold text-sm">{folder.scholarName}</h4><Badge variant="outline" className="text-[10px] font-mono">{folder.scholarId}</Badge></div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>{folder.totalFiles} ไฟล์</span><span>{folder.totalSize}</span><span>แก้ไขล่าสุด: {folder.lastModified}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {folder.categories.map((cat, j) => (
                        <Badge key={j} variant="outline" className="text-[9px]"><Tag className="w-2.5 h-2.5 mr-0.5" />{cat.name} ({cat.count})</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* File List inside folder */
        <>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => setSelectedFolder(null)} className="text-blue-600 hover:underline">แฟ้มข้อมูลทั้งหมด</button>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-700">{selectedFolder.scholarName} ({selectedFolder.scholarId})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Input placeholder="ค้นหาไฟล์..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64" />
              <div className="flex gap-1">
                {categories.map(cat => (
                  <Badge key={cat} variant={categoryFilter === cat ? 'default' : 'outline'} className="cursor-pointer text-[10px]" onClick={() => setCategoryFilter(cat)}>{cat}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
              <Button size="sm" variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
              <Button onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4 mr-1" />อัปโหลด</Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>ชื่อไฟล์</TableHead><TableHead>หมวดหมู่</TableHead><TableHead>ขนาด</TableHead><TableHead>เวอร์ชัน</TableHead><TableHead>อัปโหลดโดย</TableHead><TableHead>วันที่</TableHead><TableHead>สถานะ</TableHead><TableHead></TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file, i) => {
                      const fti = fileTypeIcon[file.type] || fileTypeIcon.PDF;
                      const FileIcon = fti.icon;
                      const st = statusMap[file.status];
                      const StatusIcon = st.icon;
                      return (
                        <TableRow key={file.id} className="hover:bg-blue-50/50">
                          <TableCell><div className="flex items-center gap-2"><FileIcon className={`w-5 h-5 ${fti.color}`} /><div><p className="text-sm font-medium">{file.name}</p><p className="text-[10px] text-gray-400">{file.type}</p></div></div></TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{file.category}</Badge></TableCell>
                          <TableCell className="text-xs text-gray-600">{file.size}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">v{file.version}</Badge></TableCell>
                          <TableCell className="text-xs text-gray-600">{file.uploadedBy}</TableCell>
                          <TableCell className="text-xs text-gray-600">{file.uploadedDate}</TableCell>
                          <TableCell><Badge className={`text-[10px] ${st.bg} ${st.color} border`}><StatusIcon className="w-3 h-3 mr-0.5" />{st.label}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => toast.info(`ดูตัวอย่าง ${file.name}`)}><Eye className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => toast.success(`ดาวน์โหลด ${file.name}`)}><Download className="w-3.5 h-3.5" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredFiles.map((file, i) => {
                const fti = fileTypeIcon[file.type] || fileTypeIcon.PDF;
                const FileIcon = fti.icon;
                return (
                  <motion.div key={file.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
                    <Card className="hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <FileIcon className={`w-10 h-10 mx-auto mb-2 ${fti.color}`} />
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-400">{file.size}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Upload Dialog */}
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
                <DialogTitle className="text-white text-lg flex items-center gap-2"><Upload className="w-5 h-5" />อัปโหลดเอกสาร</DialogTitle>
                <DialogDescription className="text-green-100 mt-1">เพิ่มเอกสารใหม่ลงแฟ้มของ {selectedFolder.scholarName}</DialogDescription>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => toast.info('เลือกไฟล์...')}>
                  <Upload className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือก</p>
                  <p className="text-[10px] text-gray-400 mt-1">รองรับ PDF, DOCX, XLSX, JPG, PNG (สูงสุด 50MB)</p>
                </div>
                <div className="space-y-2"><Label>หมวดหมู่</Label>
                  <Select><SelectTrigger><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger><SelectContent>{categories.filter(c => c !== 'ทั้งหมด').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>ยกเลิก</Button>
                <Button onClick={() => { setUploadOpen(false); toast.success('อัปโหลดสำเร็จ'); }}>อัปโหลด</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

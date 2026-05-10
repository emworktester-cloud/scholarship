import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Star,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  UserPlus,
  Tag,
  Send,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { PermissionPanel } from '../components/rbac/PermissionPanel';

// Mock data for task inbox
const tasks = [
  {
    id: 'REQ-2026-001',
    applicant: 'นายสมชาย ใจดี',
    requestType: 'ขอขยายระยะเวลาศึกษา',
    status: 'รอตรวจเอกสาร',
    priority: 'high',
    sla: 'เหลือ 2 ชั่วโมง',
    slaStatus: 'critical',
    assignee: 'คุณ',
    updatedAt: '10 นาทีที่แล้ว',
    watched: true,
    hasNewDocs: true,
    tags: ['เอกสารไม่ครบ'],
  },
  {
    id: 'REQ-2026-002',
    applicant: 'นางสาวสมหญิง รักเรียน',
    requestType: 'การย้ายสถานศึกษา',
    status: 'รอพิจารณา',
    priority: 'medium',
    sla: 'เหลือ 1 วัน',
    slaStatus: 'warning',
    assignee: 'นางสาววิภา',
    updatedAt: '1 ชั่วโมงที่แล้ว',
    watched: false,
    hasNewDocs: false,
    tags: [],
  },
  {
    id: 'REQ-2026-003',
    applicant: 'นายประยุทธ์ ขยัน',
    requestType: 'ขออนุมัติไปร่วมประชุมทางวิชาการ',
    status: 'รออนุมัติ',
    priority: 'low',
    sla: 'เหลือ 3 วัน',
    slaStatus: 'normal',
    assignee: 'นายสมชาย',
    updatedAt: '3 ชั่วโมงที่แล้ว',
    watched: false,
    hasNewDocs: false,
    tags: ['เร่งด่วน'],
  },
  {
    id: 'REQ-2026-004',
    applicant: 'นางสาวกนกวรรณ ดี',
    requestType: 'ขอเลื่อนกำหนดการเดินทาง',
    status: 'รอตอบข้อมูลเพิ่ม',
    priority: 'high',
    sla: 'เหลือ 5 ชั่วโมง',
    slaStatus: 'warning',
    assignee: 'คุณ',
    updatedAt: '2 ชั่วโมงที่แล้ว',
    watched: true,
    hasNewDocs: true,
    tags: ['รอผู้สมัคร'],
  },
  {
    id: 'REQ-2026-005',
    applicant: 'นายสมเกียรติ ยิ่งใหญ่',
    requestType: 'ลงนามลายเซ็นอิเล็กทรอนิกส์ (e-Sign)',
    status: 'รอตรวจเอกสาร',
    priority: 'high',
    sla: 'เหลือ 1 ชั่วโมง',
    slaStatus: 'critical',
    assignee: 'คุณ',
    updatedAt: '5 นาทีที่แล้ว',
    watched: false,
    hasNewDocs: false,
    tags: ['e-Sign'],
  },
];

export default function Applications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(() => {
    if (location.pathname.includes('/e-sign')) return 'e-sign';
    return 'all';
  });
  const [filterAssignee, setFilterAssignee] = useState(() => {
    if (location.pathname.endsWith('/all')) return 'all';
    if (location.pathname.includes('/workspace')) return 'me';
    return 'all';
  });
  const [activeTab, setActiveTab] = useState('all');

  React.useEffect(() => {
    if (location.pathname.endsWith('/all')) {
      setFilterAssignee('all');
      setFilterType('all');
    } else if (location.pathname.includes('/e-sign')) {
      setFilterType('e-sign');
      setFilterAssignee('me');
    } else if (location.pathname.includes('/workspace')) {
      setFilterAssignee('me');
      setFilterType('all');
    }
  }, [location.pathname]);

  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!task.id.toLowerCase().includes(q) &&
          !task.applicant.toLowerCase().includes(q) &&
          !task.requestType.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (filterType !== 'all') {
      if (filterType === 'extend' && !task.requestType.includes('ขอขยายระยะเวลาศึกษา')) return false;
      if (filterType === 'transfer' && !task.requestType.includes('การย้ายสถานศึกษา')) return false;
      if (filterType === 'conference' && !task.requestType.includes('ประชุม')) return false;
      if (filterType === 'delay' && !task.requestType.includes('ขอเลื่อน')) return false;
      if (filterType === 'e-sign' && !task.requestType.includes('ลายเซ็น')) return false;
    }

    if (filterAssignee !== 'all') {
      if (filterAssignee === 'me' && task.assignee !== 'คุณ') return false;
      if (filterAssignee === 'team' && task.assignee === 'คุณ') return false;
    }

    if (activeTab !== 'all') {
      if (activeTab === 'checking' && task.status !== 'รอตรวจเอกสาร') return false;
      if (activeTab === 'requesting' && task.status !== 'รอตอบข้อมูลเพิ่ม') return false;
      if (activeTab === 'reviewing' && task.status !== 'รอพิจารณา') return false;
      if (activeTab === 'approving' && task.status !== 'รออนุมัติ') return false;
      if (activeTab === 'overdue' && task.slaStatus !== 'critical') return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(t => t.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleBulkAssign = () => {
    toast.success(`มอบหมายงาน ${selectedTasks.length} รายการเรียบร้อย`, {
      description: 'งานถูกมอบหมายให้ผู้รับผิดชอบใหม่แล้ว',
    });
    setSelectedTasks([]);
  };

  const handleBulkTag = () => {
    toast.success(`เพิ่มป้ายให้ ${selectedTasks.length} รายการเรียบร้อย`);
    setSelectedTasks([]);
  };

  const handleBulkNotify = () => {
    toast.success(`ส่งแจ้งเตือน ${selectedTasks.length} รายการเรียบร้อย`);
    setSelectedTasks([]);
  };

  const handleWatchToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(task.watched ? `ยกเลิกติดตาม ${taskId}` : `ติดตาม ${taskId} แล้ว`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 font-semibold';
      case 'warning': return 'text-yellow-600 font-medium';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title={location.pathname.includes('/e-sign') ? "ลายเซ็นอิเล็กทรอนิกส์" : location.pathname.endsWith('/all') ? "คำร้องทั้งหมด" : "งานรอดำเนินการ"}
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'คิวงาน' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              ตัวกรอง
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Main Workspace Navigation Tabs */}
        <Tabs value={location.pathname} onValueChange={(val) => navigate(val)} className="w-full">
          <TabsList className="mb-2 grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="/workspace">คิวงานของฉัน</TabsTrigger>
            <TabsTrigger value="/workspace/all">งานทั้งหมด</TabsTrigger>
            <TabsTrigger value="/workspace/e-sign">e-Sign</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Permission Panel */}
        <PermissionPanel
          pageName="คิวงาน"
          moduleName="applications"
          defaultExpanded={false}
          permissions={[
            {
              permission: 'applications:view',
              label: 'ดูคิวงาน',
              description: 'ดูรายการใบสมัครทั้งหมดในคิว',
              uiLocation: 'หน้าคิวงานหลัก',
            },
            {
              permission: 'applications:create',
              label: 'สร้างใบสมัครใหม่',
              description: 'เพิ่มใบสมัครใหม่เข้าระบบ',
              uiLocation: 'ปุ่ม "เพิ่มใบสมัคร"',
            },
            {
              permission: 'applications:edit',
              label: 'แก้ไขใบสมัคร',
              description: 'แก้ไขข้อมูลใบสมัคร',
              uiLocation: 'ปุ่ม "แก้ไข"',
            },
            {
              permission: 'applications:delete',
              label: 'ลบใบสมัคร',
              description: 'ลบใบสมัครออกจากระบบ',
              uiLocation: 'เมนู Actions > ลบ',
            },
            {
              permission: 'applications:assign',
              label: 'มอบหมายงาน',
              description: 'มอบหมายใบสมัครให้ผู้รับผิดชอบ',
              uiLocation: 'ปุ่ม "มอบหมาย"',
            },
            {
              permission: 'applications:bulk_operations',
              label: 'จัดการหลายรายการ',
              description: 'ดำเนินการกับหลายใบสมัครพร้อมกัน',
              uiLocation: 'Bulk Actions Bar',
            },
          ]}
        />

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border p-4 space-y-4"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ค้นหาคำขอ / รหัสเคส / ชื่อผู้ยื่น"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ประเภทคำขอ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="extend">ขอขยายเวลาศึกษา</SelectItem>
                <SelectItem value="transfer">การย้ายสถานศึกษา</SelectItem>
                <SelectItem value="conference">ร่วมประชุมวิชาการ</SelectItem>
                <SelectItem value="delay">ขอเลื่อนเดินทาง</SelectItem>
                <SelectItem value="e-sign">ลายเซ็นอิเล็กทรอนิกส์</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ผู้รับผิดชอบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกคน</SelectItem>
                <SelectItem value="me">งานของฉัน</SelectItem>
                <SelectItem value="team">ทีมของฉัน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">
                เลือกแล้ว {selectedTasks.length} รายการ
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={handleBulkAssign}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  มอบหมาย
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkTag}>
                  <Tag className="w-4 h-4 mr-2" />
                  เพิ่มป้าย
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkNotify}>
                  <Send className="w-4 h-4 mr-2" />
                  แจ้งเตือน
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              ทั้งหมด
              <Badge variant="secondary" className="ml-2">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="new">
              งานใหม่เข้า
              <Badge variant="secondary" className="ml-2">5</Badge>
            </TabsTrigger>
            <TabsTrigger value="checking">
              รอตรวจเอกสาร
              <Badge variant="secondary" className="ml-2">8</Badge>
            </TabsTrigger>
            <TabsTrigger value="requesting">
              รอตอบข้อมูลเพิ่ม
              <Badge variant="secondary" className="ml-2">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewing">
              รอพิจารณา
              <Badge variant="secondary" className="ml-2">4</Badge>
            </TabsTrigger>
            <TabsTrigger value="approving">
              รออนุมัติ
              <Badge variant="secondary" className="ml-2">2</Badge>
            </TabsTrigger>
            <ProtectedTabsTrigger value="overdue" permission="applications:view">
              <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
              เกิน SLA
              <Badge variant="destructive" className="ml-2">2</Badge>
            </ProtectedTabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>ความสำคัญ</TableHead>
                    <TableHead>รหัสเคส</TableHead>
                    <TableHead>ผู้ยื่นคำขอ</TableHead>
                    <TableHead>ประเภทคำขอ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>ผู้รับผิดชอบ</TableHead>
                    <TableHead>อัปเดตล่าสุด</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-10 text-gray-500">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="group hover:bg-blue-50/50 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                          onClick={() => handleWatchToggle(task.id)}
                        >
                          <Star className={`w-4 h-4 ${task.watched ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                          {task.priority === 'high' ? 'เร่งด่วน' : task.priority === 'medium' ? 'ปกติ' : 'ต่ำ'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{task.id}</span>
                          {task.hasNewDocs && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" title="มีเอกสารใหม่" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{task.applicant}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{task.requestType}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${getSLAColor(task.slaStatus)}`}>
                          {task.sla}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">{task.assignee}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">{task.updatedAt}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/applications/${task.id}`}>
                            <Button size="sm" variant="outline">
                              เปิดเคส
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast.success(`มอบหมาย ${task.id} ใหม่`)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                มอบหมายใหม่
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`เพิ่มป้ายให้ ${task.id}`)}>
                                <Tag className="w-4 h-4 mr-2" />
                                เพิ่มป้าย
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`ส่งแจ้งเตือน ${task.id}`)}>
                                <Send className="w-4 h-4 mr-2" />
                                ส่งแจ้งเตือน
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

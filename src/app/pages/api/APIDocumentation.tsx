import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Code, Play, Copy, ChevronDown, ChevronRight,
  CheckCircle, Lock, Globe, Search, Send, FileText,
  Hash, ArrowRight, Braces, Info, AlertTriangle, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

const openApiSpec = {
  version: '3.1.0',
  title: 'ระบบบริหารจัดการทุนรัฐบาล API',
  description: 'RESTful API สำหรับระบบบริหารจัดการทุนรัฐบาล สำนักงาน ก.พ.',
  baseUrl: 'https://api.scholarship.ocsc.go.th/v1',
  servers: [
    { url: 'https://api.scholarship.ocsc.go.th/v1', desc: 'Production' },
    { url: 'https://api-staging.scholarship.ocsc.go.th/v1', desc: 'Staging' },
    { url: 'http://localhost:8080/v1', desc: 'Development' },
  ],
};

interface EndpointDoc {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  group: string;
  auth: string;
  params: { name: string; in: string; type: string; required: boolean; desc: string }[];
  requestBody?: string;
  responses: { status: number; desc: string; example: string }[];
}

const endpointDocs: EndpointDoc[] = [
  {
    id: 'get-scholars', method: 'GET', path: '/scholars', summary: 'รายการนักเรียนทุน', description: 'ดึงรายชื่อนักเรียนทุนทั้งหมด พร้อม pagination, sort, filter',
    group: 'Scholars', auth: 'Bearer Token',
    params: [
      { name: 'page', in: 'query', type: 'integer', required: false, desc: 'หน้าที่ต้องการ (default: 1)' },
      { name: 'limit', in: 'query', type: 'integer', required: false, desc: 'จำนวนต่อหน้า (default: 20, max: 100)' },
      { name: 'search', in: 'query', type: 'string', required: false, desc: 'ค้นหาจากชื่อ รหัส เลขบัตรประชาชน' },
      { name: 'status', in: 'query', type: 'string', required: false, desc: 'กรองสถานะ: studying, graduated, serving, completed' },
      { name: 'source', in: 'query', type: 'string', required: false, desc: 'กรองแหล่งทุน' },
    ],
    responses: [
      { status: 200, desc: 'สำเร็จ', example: '{\n  "data": [\n    {\n      "id": "SCH-001",\n      "name": "น.ส.พรพิมล สุขใจ",\n      "status": "studying",\n      "scholarship": "ทุน ก.พ.",\n      "country": "สหราชอาณาจักร",\n      "gpa": 3.82\n    }\n  ],\n  "pagination": {\n    "page": 1,\n    "limit": 20,\n    "total": 1200,\n    "totalPages": 60\n  }\n}' },
      { status: 401, desc: 'ไม่ได้รับอนุญาต', example: '{\n  "error": "Unauthorized",\n  "message": "Token ไม่ถูกต้องหรือหมดอายุ"\n}' },
    ],
  },
  {
    id: 'get-scholar-detail', method: 'GET', path: '/scholars/:id', summary: 'รายละเอียดนักเรียนทุน', description: 'ดึงข้อมูลรายละเอียดนักเรียนทุนรายบุคคล รวมข้อมูลทุน ผลการเรียน การชดใช้ทุน',
    group: 'Scholars', auth: 'Bearer Token',
    params: [
      { name: 'id', in: 'path', type: 'string', required: true, desc: 'รหัสนักเรียนทุน เช่น SCH-001' },
    ],
    responses: [
      { status: 200, desc: 'สำเร็จ', example: '{\n  "id": "SCH-001",\n  "idCard": "1-1001-XXXXX-XX-X",\n  "prefix": "นางสาว",\n  "firstName": "พรพิมล",\n  "lastName": "สุขใจ",\n  "scholarship": {\n    "code": "AWD-2566-042",\n    "type": "ทุนรัฐบาล ก.พ.",\n    "degree": "Ph.D.",\n    "field": "Chemical Engineering",\n    "university": "University of Oxford"\n  },\n  "progress": { "percent": 55, "gpa": 3.82 },\n  "serviceDebt": { "total": 730, "served": 0 }\n}' },
      { status: 404, desc: 'ไม่พบข้อมูล', example: '{\n  "error": "Not Found",\n  "message": "ไม่พบนักเรียนทุนรหัส SCH-999"\n}' },
    ],
  },
  {
    id: 'post-application', method: 'POST', path: '/applications', summary: 'ส่งคำขอใหม่', description: 'สร้างคำขอ/ใบสมัครใหม่เข้าระบบ',
    group: 'Applications', auth: 'Bearer Token',
    params: [],
    requestBody: '{\n  "formType": "EF-01",\n  "scholarId": "SCH-001",\n  "title": "ขออนุมัติเดินทางไปศึกษา",\n  "data": {\n    "destination": "United Kingdom",\n    "departureDate": "2569-08-01",\n    "returnDate": "2570-07-31"\n  },\n  "attachments": ["file-uuid-1", "file-uuid-2"]\n}',
    responses: [
      { status: 201, desc: 'สร้างสำเร็จ', example: '{\n  "id": "APP-2569-0086",\n  "status": "submitted",\n  "createdAt": "2569-02-25T10:00:00+07:00",\n  "message": "ส่งคำขอเรียบร้อย"\n}' },
      { status: 422, desc: 'ข้อมูลไม่ถูกต้อง', example: '{\n  "error": "Validation Error",\n  "details": [\n    { "field": "data.departureDate", "message": "กรุณากรอกวันเดินทาง" }\n  ]\n}' },
    ],
  },
  {
    id: 'post-auth-login', method: 'POST', path: '/auth/login', summary: 'เข้าสู่ระบบ', description: 'ยืนยันตัวตนและรับ Access Token',
    group: 'Authentication', auth: 'Public',
    params: [],
    requestBody: '{\n  "username": "user@ocsc.go.th",\n  "password": "********"\n}',
    responses: [
      { status: 200, desc: 'สำเร็จ', example: '{\n  "accessToken": "eyJhbGciOiJSUzI1NiIs...",\n  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",\n  "expiresIn": 3600,\n  "tokenType": "Bearer",\n  "user": {\n    "id": "USR-001",\n    "name": "นายประสิทธิ์ ผู้ดูแล",\n    "role": "admin"\n  }\n}' },
      { status: 401, desc: 'ข้อมูลไม่ถูกต้อง', example: '{\n  "error": "Invalid credentials",\n  "message": "Username หรือ Password ไม่ถูกต้อง"\n}' },
    ],
  },
];

const methodColor: Record<string, string> = {
  GET: 'bg-green-500', POST: 'bg-blue-500', PUT: 'bg-amber-500', DELETE: 'bg-red-500',
};
const methodBg: Record<string, string> = {
  GET: 'bg-green-50 border-green-200', POST: 'bg-blue-50 border-blue-200', PUT: 'bg-amber-50 border-amber-200', DELETE: 'bg-red-50 border-red-200',
};

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc | null>(endpointDocs[0]);
  const [tryItResponse, setTryItResponse] = useState('');
  const [tryItLoading, setTryItLoading] = useState(false);

  const handleTryIt = () => {
    setTryItLoading(true);
    setTimeout(() => {
      setTryItResponse(selectedEndpoint?.responses[0].example || '');
      setTryItLoading(false);
      toast.success('API Response received');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* OAS Header */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" />{openApiSpec.title}</CardTitle>
              <CardDescription className="mt-1">{openApiSpec.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">OpenAPI {openApiSpec.version}</Badge>
              <Button size="sm" variant="outline" onClick={() => toast.info('ดาวน์โหลด OpenAPI spec (JSON)')}><Code className="w-3.5 h-3.5 mr-1" />OAS JSON</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Servers</Label>
            <div className="flex gap-2 flex-wrap">
              {openApiSpec.servers.map((s, i) => (
                <Badge key={i} variant="outline" className="font-mono text-xs gap-1"><Globe className="w-3 h-3" />{s.desc}: {s.url}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="col-span-4 space-y-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {endpointDocs.map((ep) => (
                <div key={ep.id} onClick={() => setSelectedEndpoint(ep)} className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${selectedEndpoint?.id === ep.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                  <Badge className={`text-[9px] font-mono w-12 justify-center text-white ${methodColor[ep.method]}`}>{ep.method}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono truncate">{ep.path}</p>
                    <p className="text-[10px] text-gray-500 truncate">{ep.summary}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Detail + Try It */}
        <div className="col-span-8 space-y-4">
          {selectedEndpoint && (
            <>
              {/* Endpoint Header */}
              <Card className={`border ${methodBg[selectedEndpoint.method]}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge className={`text-white font-mono ${methodColor[selectedEndpoint.method]}`}>{selectedEndpoint.method}</Badge>
                    <code className="text-sm font-mono font-medium">{openApiSpec.baseUrl}{selectedEndpoint.path}</code>
                    <Badge variant="outline" className="text-[10px]"><Lock className="w-3 h-3 mr-0.5" />{selectedEndpoint.auth}</Badge>
                  </div>
                  <p className="text-sm font-semibold mt-2">{selectedEndpoint.summary}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedEndpoint.description}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="params" className="space-y-3">
                <TabsList>
                  <TabsTrigger value="params">Parameters</TabsTrigger>
                  {selectedEndpoint.requestBody && <TabsTrigger value="body">Request Body</TabsTrigger>}
                  <TabsTrigger value="responses">Responses</TabsTrigger>
                  <TabsTrigger value="tryit">Try It Out</TabsTrigger>
                </TabsList>

                {/* Parameters */}
                <TabsContent value="params">
                  <Card>
                    <CardContent className="p-4">
                      {selectedEndpoint.params.length > 0 ? (
                        <div className="space-y-2">
                          {selectedEndpoint.params.map((p, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm font-mono font-semibold">{p.name}</code>
                                  <Badge variant="outline" className="text-[9px]">{p.in}</Badge>
                                  <Badge variant="outline" className="text-[9px]">{p.type}</Badge>
                                  {p.required && <Badge className="bg-red-100 text-red-700 text-[9px]">required</Badge>}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">ไม่มี Parameters</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <TabsContent value="body">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">application/json</Badge>
                          <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(selectedEndpoint.requestBody || ''); toast.success('คัดลอกแล้ว'); }}><Copy className="w-3.5 h-3.5 mr-1" />คัดลอก</Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">{selectedEndpoint.requestBody}</pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* Responses */}
                <TabsContent value="responses">
                  <div className="space-y-3">
                    {selectedEndpoint.responses.map((r, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${r.status < 400 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} font-mono`}>{r.status}</Badge>
                            <span className="text-xs text-gray-500">{r.desc}</span>
                          </div>
                          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">{r.example}</pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Try It Out */}
                <TabsContent value="tryit">
                  <Card className="border-green-200">
                    <CardHeader className="pb-2 bg-green-50 rounded-t-xl">
                      <CardTitle className="text-sm flex items-center gap-2"><Play className="w-4 h-4 text-green-600" />ทดลองเรียกใช้ API</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1.5">
                          <Label className="text-xs">URL</Label>
                          <Input defaultValue={`${openApiSpec.baseUrl}${selectedEndpoint.path}`} className="font-mono text-xs" />
                        </div>
                        <div className="w-48 space-y-1.5">
                          <Label className="text-xs">Authorization</Label>
                          <Input defaultValue="Bearer eyJhbGc..." className="font-mono text-xs" type="password" />
                        </div>
                      </div>
                      {selectedEndpoint.params.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">Parameters</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedEndpoint.params.map((p, i) => (
                              <Input key={i} placeholder={`${p.name} (${p.type})`} className="text-xs" />
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedEndpoint.requestBody && (
                        <div className="space-y-1.5">
                          <Label className="text-xs">Request Body</Label>
                          <Textarea defaultValue={selectedEndpoint.requestBody} className="font-mono text-xs min-h-32" />
                        </div>
                      )}
                      <Button onClick={handleTryIt} disabled={tryItLoading} className="bg-green-600 hover:bg-green-700">
                        {tryItLoading ? <><Zap className="w-4 h-4 mr-1 animate-spin" />กำลังส่ง...</> : <><Send className="w-4 h-4 mr-1" />ส่ง Request</>}
                      </Button>
                      {tryItResponse && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs text-gray-500">Response</Label>
                            <Badge className="bg-green-100 text-green-700 text-[10px]">200 OK</Badge>
                          </div>
                          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">{tryItResponse}</pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

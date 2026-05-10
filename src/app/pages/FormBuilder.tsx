import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Save,
  Play,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Hash,
  AlignLeft,
  ListChecks,
  Circle,
  Calendar,
  Upload,
  ToggleLeft,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  ChevronDown,
  Copy,
  Settings,
  FileText,
  X,
} from 'lucide-react';
import { DatePicker } from '../components/ui/date-picker';
import { toast } from 'sonner';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: string;
  helpText?: string;
  width?: 'full' | 'half';
}

const fieldTypes = [
  { type: 'text', label: 'ข้อความสั้น', icon: Type },
  { type: 'textarea', label: 'ข้อความยาว', icon: AlignLeft },
  { type: 'number', label: 'ตัวเลข', icon: Hash },
  { type: 'email', label: 'อีเมล', icon: Mail },
  { type: 'phone', label: 'โทรศัพท์', icon: Phone },
  { type: 'date', label: 'วันที่', icon: Calendar },
  { type: 'select', label: 'ดรอปดาวน์', icon: ListChecks },
  { type: 'radio', label: 'ตัวเลือก (Radio)', icon: Circle },
  { type: 'checkbox', label: 'เช็คบ็อกซ์', icon: ToggleLeft },
  { type: 'file', label: 'อัปโหลดไฟล์', icon: Upload },
  { type: 'address', label: 'ที่อยู่', icon: MapPin },
];

const defaultFormFields: FormField[] = [
  { id: 'f1', type: 'text', label: 'ชื่อ-นามสกุล', placeholder: 'กรอกชื่อ-นามสกุล', required: true, width: 'full' },
  { id: 'f2', type: 'email', label: 'อีเมล', placeholder: 'example@email.com', required: true, width: 'half' },
  { id: 'f3', type: 'phone', label: 'เบอร์โทรศัพท์', placeholder: '08X-XXX-XXXX', required: true, width: 'half' },
  { id: 'f4', type: 'select', label: 'ประเภททุน', required: true, options: ['ทุนปริญญาเอก', 'ทุนปริญญาโท', 'ทุนวิจัย', 'ทุนฝึกอบรม'], width: 'full' },
  { id: 'f5', type: 'textarea', label: 'เหตุผลในการสมัคร', placeholder: 'อธิบายเหตุผลและแรงจูงใจ...', required: false, width: 'full' },
  { id: 'f6', type: 'file', label: 'เอกสารแนบ', required: true, helpText: 'รองรับ PDF, JPG, PNG ขนาดไม่เกิน 10MB', width: 'full' },
];

export default function FormBuilder() {
  const [formName, setFormName] = useState('แบบฟอร์มสมัครทุนการศึกษา');
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingOption, setEditingOption] = useState('');

  const selectedFieldData = formFields.find(f => f.id === selectedField);

  const addField = (type: string) => {
    const fieldType = fieldTypes.find(f => f.type === type);
    const newField: FormField = {
      id: `f${Date.now()}`,
      type,
      label: fieldType?.label || 'ฟิลด์ใหม่',
      placeholder: '',
      required: false,
      options: (type === 'select' || type === 'radio') ? ['ตัวเลือก 1', 'ตัวเลือก 2'] : undefined,
      width: 'full',
    };
    setFormFields([...formFields, newField]);
    setSelectedField(newField.id);
    toast.success(`เพิ่มฟิลด์ "${fieldType?.label}" แล้ว`);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
    if (selectedField === id) setSelectedField(null);
    toast.success('ลบฟิลด์เรียบร้อย');
  };

  const duplicateField = (id: string) => {
    const field = formFields.find(f => f.id === id);
    if (!field) return;
    const newField = { ...field, id: `f${Date.now()}`, label: `${field.label} (สำเนา)` };
    const index = formFields.findIndex(f => f.id === id);
    const updated = [...formFields];
    updated.splice(index + 1, 0, newField);
    setFormFields(updated);
    toast.success('สำเนาฟิลด์เรียบร้อย');
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = formFields.findIndex(f => f.id === id);
    if (direction === 'up' && index > 0) {
      const updated = [...formFields];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setFormFields(updated);
    } else if (direction === 'down' && index < formFields.length - 1) {
      const updated = [...formFields];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setFormFields(updated);
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addOption = (fieldId: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    updateField(fieldId, { options: [...field.options, `ตัวเลือก ${field.options.length + 1}`] });
  };

  const removeOption = (fieldId: string, index: number) => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    updateField(fieldId, { options: field.options.filter((_, i) => i !== index) });
  };

  const updateOption = (fieldId: string, index: number, value: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    const updated = [...field.options];
    updated[index] = value;
    updateField(fieldId, { options: updated });
  };

  const getFieldIcon = (type: string) => {
    const ft = fieldTypes.find(f => f.type === type);
    return ft?.icon || Type;
  };

  const handleSave = () => {
    toast.success('บันทึกแบบฟอร์มเรียบร้อย');
  };

  const handlePublish = () => {
    toast.success('เผยแพร่แบบฟอร์มเรียบร้อย');
  };

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return <Input placeholder={field.placeholder || `กรอก${field.label}`} disabled />;
      case 'number':
        return <Input type="number" placeholder={field.placeholder || '0'} disabled />;
      case 'textarea':
        return <Textarea placeholder={field.placeholder || `กรอก${field.label}`} disabled className="min-h-20" />;
      case 'date':
        return <DatePicker disabled />;
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={`เลือก${field.label}`} />
            </SelectTrigger>
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" disabled name={field.id} className="w-4 h-4" />
                <span className="text-sm">{opt}</span>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox disabled />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
            <p className="text-sm text-gray-500">คลิกเพื่ออัปโหลดไฟล์</p>
            {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2">
            <Input placeholder="ที่อยู่" disabled />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="ตำบล/แขวง" disabled />
              <Input placeholder="อำเภอ/เขต" disabled />
              <Input placeholder="จังหวัด" disabled />
              <Input placeholder="รหัสไปรษณีย์" disabled />
            </div>
          </div>
        );
      default:
        return <Input placeholder={field.placeholder} disabled />;
    }
  };

  return (
    <div className="min-h-full bg-card">
      <PageHeader
        title="ตัวสร้างแบบฟอร์ม"
        breadcrumbs={[
          { label: 'แดชบอร์ด', path: '/' },
          { label: 'Workflow', path: '/workflows' },
          { label: 'ตัวสร้างแบบฟอร์ม' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              ดูตัวอย่าง
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              บันทึก
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handlePublish}>
              <Play className="h-4 w-4 mr-2" />
              เผยแพร่
            </Button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-144px)]">
        {/* Left Panel - Field Palette */}
        <div className="w-60 border-r bg-white p-4 overflow-y-auto">
          <h3 className="font-semibold mb-3 text-sm text-gray-700">ประเภทฟิลด์</h3>
          <div className="space-y-1.5">
            {fieldTypes.map((ft) => {
              const Icon = ft.icon;
              return (
                <motion.button
                  key={ft.type}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 text-left transition-colors text-sm"
                  onClick={() => addField(ft.type)}
                >
                  <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-700">{ft.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Center - Form Canvas */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Form Name */}
            <div className="bg-white rounded-lg border p-4">
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-xl font-semibold border-0 p-0 focus-visible:ring-0 shadow-none"
                placeholder="ชื่อแบบฟอร์ม..."
              />
              <p className="text-sm text-gray-500 mt-1">{formFields.length} ฟิลด์</p>
            </div>

            {/* Fields */}
            <AnimatePresence>
              {formFields.map((field, index) => {
                const Icon = getFieldIcon(field.type);
                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${selectedField === field.id ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-blue-200'}`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 mt-1">
                        <button onClick={(e) => { e.stopPropagation(); moveField(field.id, 'up'); }} className="p-0.5 hover:bg-gray-100 rounded" disabled={index === 0}>
                          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                        <button onClick={(e) => { e.stopPropagation(); moveField(field.id, 'down'); }} className="p-0.5 hover:bg-gray-100 rounded" disabled={index === formFields.length - 1}>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-sm">{field.label}</span>
                          {field.required && <span className="text-red-500 text-xs">*</span>}
                          <Badge variant="outline" className="text-xs ml-auto">{fieldTypes.find(f => f.type === field.type)?.label}</Badge>
                        </div>
                        {renderFieldPreview(field)}
                        {field.helpText && <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>}
                      </div>

                      <div className="flex flex-col gap-1">
                        <button onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }} className="p-1.5 hover:bg-gray-100 rounded" title="สำเนา">
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeField(field.id); }} className="p-1.5 hover:bg-red-50 rounded" title="ลบ">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add Field Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => addField('text')}
            >
              <Plus className="w-5 h-5" />
              เพิ่มฟิลด์ใหม่
            </motion.button>
          </div>
        </div>

        {/* Right Panel - Field Properties */}
        <div className="w-80 border-l bg-white p-5 overflow-y-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-gray-600" />
            ตั้งค่าฟิลด์
          </h3>

          {selectedFieldData ? (
            <motion.div
              key={selectedFieldData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label className="text-sm">ชื่อฟิลด์</Label>
                <Input
                  value={selectedFieldData.label}
                  onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ข้อความ Placeholder</Label>
                <Input
                  value={selectedFieldData.placeholder || ''}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                  placeholder="ข้อความช่วยเหลือในช่อง"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ข้อความช่วยเหลือ</Label>
                <Input
                  value={selectedFieldData.helpText || ''}
                  onChange={(e) => updateField(selectedFieldData.id, { helpText: e.target.value })}
                  placeholder="แสดงใต้ช่องกรอก"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">จำเป็นต้องกรอก</Label>
                <Switch
                  checked={selectedFieldData.required}
                  onCheckedChange={(checked) => updateField(selectedFieldData.id, { required: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ความกว้าง</Label>
                <Select
                  value={selectedFieldData.width || 'full'}
                  onValueChange={(value) => updateField(selectedFieldData.id, { width: value as 'full' | 'half' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">เต็มความกว้าง</SelectItem>
                    <SelectItem value="half">ครึ่งความกว้าง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Options for select/radio */}
              {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio') && selectedFieldData.options && (
                <div className="space-y-3">
                  <Label className="text-sm">ตัวเลือก</Label>
                  <div className="space-y-2">
                    {selectedFieldData.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => updateOption(selectedFieldData.id, i, e.target.value)}
                          className="flex-1"
                        />
                        <button
                          onClick={() => removeOption(selectedFieldData.id, i)}
                          className="p-1.5 hover:bg-red-50 rounded"
                          disabled={selectedFieldData.options!.length <= 1}
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => addOption(selectedFieldData.id)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    เพิ่มตัวเลือก
                  </Button>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-red-600">ลบฟิลด์</Label>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => removeField(selectedFieldData.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ลบฟิลด์นี้
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">เลือกฟิลด์เพื่อแก้ไขการตั้งค่า</p>
              <p className="text-xs text-gray-400 mt-1">หรือลากฟิลด์จากแผงด้านซ้าย</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              ตัวอย่างแบบฟอร์ม
            </DialogTitle>
            <DialogDescription>
              แสดงตัวอย่างแบบฟอร์มตามที่ผู้สมัครจะเห็น
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center pb-4 border-b">
              <h2 className="text-xl font-bold text-blue-900">{formName}</h2>
              <p className="text-sm text-gray-500 mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
            </div>

            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderFieldPreview(field)}
                {field.helpText && <p className="text-xs text-gray-400">{field.helpText}</p>}
              </div>
            ))}

            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">
                ส่งใบสมัคร
              </Button>
              <Button variant="outline">
                บันทึกฉบับร่าง
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

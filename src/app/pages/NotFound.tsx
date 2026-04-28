import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e0f2fe] mb-6">
          <FileQuestion className="h-10 w-10 text-[#3b82f6]" />
        </div>
        <h1 className="text-6xl font-bold text-[#1e3a8a] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          ไม่พบหน้าที่คุณกำลังค้นหา
        </h2>
        <p className="text-muted-foreground mb-8">
          ขออภัย หน้าที่คุณพยายามเข้าถึงไม่มีอยู่ในระบบ
        </p>
        <Link to="/">
          <Button className="bg-[#1e3a8a] hover:bg-[#1e40af]">
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  );
}

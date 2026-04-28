import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, FileText, User, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface SearchResult {
  id: string;
  type: 'application' | 'award' | 'user' | 'report';
  title: string;
  subtitle: string;
  url: string;
  metadata?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'application',
    title: 'APP-2026-001',
    subtitle: 'นายสมชาย ใจดี - ทุนปริญญาเอก',
    url: '/applications/APP-2026-001',
    metadata: 'รอตรวจเอกสาร'
  },
  {
    id: '2',
    type: 'application',
    title: 'APP-2026-002',
    subtitle: 'นางสาวสมหญิง รักเรียน - ทุนวิจัย',
    url: '/applications/APP-2026-002',
    metadata: 'รอพิจารณา'
  },
  {
    id: '3',
    type: 'award',
    title: 'AWD-2025-145',
    subtitle: 'ทุนวิจัย - นายวิชัย นักวิจัย',
    url: '/awards/AWD-2025-145',
    metadata: 'กำลังดำเนินการ'
  },
];

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearch({ isOpen, onClose }: QuickSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'APP-2026',
    'นายสมชาย',
    'ทุนปริญญาเอก'
  ]);

  useEffect(() => {
    if (query.trim().length > 0) {
      // Simulate search
      const filtered = mockSearchResults.filter(
        r => r.title.toLowerCase().includes(query.toLowerCase()) ||
             r.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'award':
        return <Award className="w-4 h-4 text-green-500" />;
      case 'user':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'report':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [result.title, ...prev.filter(s => s !== result.title)].slice(0, 5);
      return newSearches;
    });
    window.location.href = result.url;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-2xl bg-card rounded-lg shadow-2xl border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="ค้นหาใบสมัคร, ทุน, ผู้ใช้งาน... (กด Esc เพื่อปิด)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 text-base border-0 focus-visible:ring-0 bg-transparent"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <ScrollArea className="max-h-[400px]">
                {query.trim().length === 0 ? (
                  // Recent Searches
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">ค้นหาล่าสุด</h3>
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ล้างทั้งหมด
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setQuery(search)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p className="font-medium mb-2">เคล็ดลับการค้นหา:</p>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>ค้นหาด้วยรหัสเคส เช่น APP-2026-001</li>
                        <li>ค้นหาด้วยชื่อผู้สมัคร เช่น "สมชาย"</li>
                        <li>ค้นหาด้วยประเภททุน เช่น "ปริญญาเอก"</li>
                      </ul>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  // Search Results
                  <div className="divide-y">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left group"
                      >
                        <div className="flex-shrink-0">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        {result.metadata && (
                          <Badge variant="secondary" className="text-xs">
                            {result.metadata}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  // No Results
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">ไม่พบผลลัพธ์สำหรับ "{query}"</p>
                    <p className="text-xs mt-2">ลองค้นหาด้วยคำค้นอื่นหรือตรวจสอบการสะกดคำ</p>
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-card border rounded text-xs">Esc</kbd>
                    <span>ปิด</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-card border rounded text-xs">↑</kbd>
                    <kbd className="px-2 py-1 bg-card border rounded text-xs">↓</kbd>
                    <span>เลือก</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-card border rounded text-xs">Enter</kbd>
                    <span>เปิด</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

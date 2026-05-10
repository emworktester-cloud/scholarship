const fs = require('fs');

const files = [
  'src/app/pages/scholar-lifecycle/PreDeparture.tsx',
  'src/app/pages/scholar-lifecycle/DuringStudy.tsx',
  'src/app/pages/scholar-lifecycle/PostGraduation.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Revert all previous broken attempts
  content = content.replace(/<div className=\"overflow-x-auto\"><Table/g, '<Table');
  content = content.replace(/<\/Table><\/div>/g, '</Table>');

  // Also revert the ones that matched TableHead/TableCell etc.
  content = content.replace(/<div className=\"overflow-x-auto\"><TableHead/g, '<TableHead');
  content = content.replace(/<div className=\"overflow-x-auto\"><TableBody/g, '<TableBody');
  content = content.replace(/<div className=\"overflow-x-auto\"><TableRow/g, '<TableRow');
  content = content.replace(/<div className=\"overflow-x-auto\"><TableCell/g, '<TableCell');
  content = content.replace(/<div className=\"overflow-x-auto\"><TableHeader/g, '<TableHeader');
  content = content.replace(/<div className=\"overflow-x-auto\"><TableFooter/g, '<TableFooter');

  // Apply specific Table wrap (match <Table but NOT <TableHead, etc.)
  // We use word boundary \b to ensure it's exactly 'Table'
  content = content.replace(/<Table(\b[^>]*?)>/g, '<div className=\"overflow-x-auto\"><Table$1>');
  content = content.replace(/<\/Table>/g, '</Table></div>');

  fs.writeFileSync(f, content);
});

console.log('Responsive fixes (Take 3) applied successfully');

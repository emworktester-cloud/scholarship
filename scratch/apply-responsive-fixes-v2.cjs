const fs = require('fs');

const files = [
  'src/app/pages/scholar-lifecycle/PreDeparture.tsx',
  'src/app/pages/scholar-lifecycle/DuringStudy.tsx',
  'src/app/pages/scholar-lifecycle/PostGraduation.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Revert previous broken Table wrap
  content = content.replace(/<div className=\"overflow-x-auto\"><Table/g, '<Table');
  content = content.replace(/<\/Table><\/div>/g, '</Table>');

  // Apply better Table wrap
  content = content.replace(/<Table([^>]*?)>/g, '<div className=\"overflow-x-auto\"><Table$1>');
  content = content.replace(/<\/Table>/g, '</Table></div>');

  fs.writeFileSync(f, content);
});

console.log('Responsive fixes (Take 2) applied successfully');

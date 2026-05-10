const fs = require('fs');

const files = [
  'src/app/pages/scholar-lifecycle/PreDeparture.tsx',
  'src/app/pages/scholar-lifecycle/DuringStudy.tsx',
  'src/app/pages/scholar-lifecycle/PostGraduation.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Navigation sidebar responsive fix
  content = content.replace(/className=\"w-full md:w-64 shrink-0 md:sticky md:top-4\"/g, 'className=\"w-full lg:w-64 shrink-0 lg:sticky lg:top-4\"');
  content = content.replace(/className=\"flex flex-col gap-1\"/g, 'className=\"flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar whitespace-nowrap lg:whitespace-normal px-1\"');
  content = content.replace(/\"flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left w-full border\"/g, '\"flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm transition-all text-left w-auto lg:w-full border shrink-0\"');

  fs.writeFileSync(f, content);
});

console.log('Responsive navigation fixes applied successfully');

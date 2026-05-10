const fs = require('fs');

const files = [
  'src/app/pages/scholar-lifecycle/PreDeparture.tsx',
  'src/app/pages/scholar-lifecycle/DuringStudy.tsx',
  'src/app/pages/scholar-lifecycle/PostGraduation.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // 1. Grid cols 2 -> 1 on mobile, 2 on sm+
  content = content.replace(/className=\"grid grid-cols-2 gap-([^\"]*?)\"/g, 'className=\"grid grid-cols-1 sm:grid-cols-2 gap-$1\"');
  
  // 2. Grid cols 3 -> 1 on mobile, 2 on sm, 3 on lg+
  content = content.replace(/className=\"grid grid-cols-3 gap-([^\"]*?)\"/g, 'className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-$1\"');
  
  // 3. Grid cols 4 -> 1 on mobile, 2 on sm, 4 on lg+
  content = content.replace(/className=\"grid grid-cols-4 gap-([^\"]*?)\"/g, 'className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-$1\"');

  // 4. Flex gap-6 or similar that should stack on mobile
  content = content.replace(/className=\"flex gap-6(.*?)\"/g, 'className=\"flex flex-col md:flex-row gap-6$1\"');
  
  // 5. Sidebar layout fix
  content = content.replace(/className=\"flex flex-col md:flex-row gap-6 items-start mt-4\"/g, 'className=\"flex flex-col lg:flex-row gap-6 items-start mt-4\"');
  content = content.replace(/className=\"w-full md:w-72 border-0 shadow-lg shrink-0\"/g, 'className=\"w-full lg:w-72 border-0 shadow-lg shrink-0\"');

  // 6. Table wrapping for horizontal scroll
  // Find <Table> and wrap it with <div className="overflow-x-auto"> if not already wrapped
  // Note: This is a bit complex for regex, but let's try a simpler approach by adding it to Table container
  content = content.replace(/<Table>/g, '<div className=\"overflow-x-auto\"><Table>');
  content = content.replace(/<\/Table>/g, '</Table></div>');

  // 7. Personal Info fields view grid fix (specifically for PreDeparture line 418)
  content = content.replace(/<FieldView label=\"ชื่อ-นามสกุล \(ไทย\)\" value=\"น\.ส\. พรพิมล สุขใจ\" className=\"text-blue-900\" \/>/g, (match) => {
    return match; // Keep it, but the parent grid was already handled in step 1/2
  });

  fs.writeFileSync(f, content);
});

console.log('Responsive fixes applied successfully');

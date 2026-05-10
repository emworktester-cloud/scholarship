const fs = require('fs');
const files = [
  'src/app/pages/scholar-lifecycle/PreDeparture.tsx',
  'src/app/pages/scholar-lifecycle/DuringStudy.tsx',
  'src/app/pages/scholar-lifecycle/PostGraduation.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace overflow-hidden in DialogContent
  // but be careful with the full-screen dialog which might need it.
  // We'll just replace overflow-hidden with max-h-[85vh] overflow-y-auto
  content = content.replace(/DialogContent className="([^"]*?)overflow-hidden([^"]*?)"/g, 'DialogContent className="$1 max-h-[85vh] overflow-y-auto $2"');
  
  fs.writeFileSync(f, content);
});
console.log('Done replacing Dialog overflow rules');

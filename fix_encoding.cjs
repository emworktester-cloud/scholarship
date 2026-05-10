const fs = require('fs'); const content = fs.readFileSync('PreDeparture_original.txt', 'utf16le'); fs.writeFileSync('src/app/pages/scholar-lifecycle/PreDeparture.tsx', content, 'utf8'); 

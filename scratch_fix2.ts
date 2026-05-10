import fs from 'fs'; const c = fs.readFileSync('src/app/pages/scholar-lifecycle/PreDeparture.tsx', 'utf8'); console.log(c.split('Move Edit Actions to bottom').length - 1); 

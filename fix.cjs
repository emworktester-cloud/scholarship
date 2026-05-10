const fs=require('fs');const p='./src/app/pages/support/ScholarshipCalculator.tsx';let t=fs.readFileSync(p,'utf8');t=t.replace(/วันสิ้.*?สุดชดใช้ทุน/g,'วันสิ้นสุดชดใช้ทุน');fs.writeFileSync(p,t);  

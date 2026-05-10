const fs = require('fs');
const p = './src/app/pages/support/ScholarshipCalculator.tsx';
let lines = fs.readFileSync(p, 'utf8').split('\n');
lines[203] = '                  <div className="text-center p-3 bg-white rounded-lg border"><p className="text-[10px] text-gray-500">วันสิ้นสุดชดใช้ทุน</p><p className="text-sm font-bold text-green-700 mt-2">{manualResult.serviceEndDate}</p></div>\r';
fs.writeFileSync(p, lines.join('\n'));

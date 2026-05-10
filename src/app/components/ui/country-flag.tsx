import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const countryMapping: Record<string, string> = {
  'สหรัฐอเมริกา': 'US',
  'สหราชอาณาจักร': 'GB',
  'ญี่ปุ่น': 'JP',
  'ออสเตรเลีย': 'AU',
  'เยอรมนี': 'DE',
  'ฝรั่งเศส': 'FR',
  'จีน': 'CN',
  'ไทย': 'TH',
  'สิงคโปร์': 'SG',
  'นิวซีแลนด์': 'NZ',
  'แคนาดา': 'CA',
  'เกาหลีใต้': 'KR',
  'ฟิลิปปินส์': 'PH',
};

interface CountryFlagProps {
  countryName: string;
  className?: string;
  showName?: boolean;
  width?: string;
  height?: string;
}

export function CountryFlag({ countryName, className = '', showName = false, width = '24px', height = '18px' }: CountryFlagProps) {
  const code = countryMapping[countryName];

  if (!code) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-lg">🌎</span>
        {showName && <span className="text-xs text-gray-700">{countryName}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div 
        className="overflow-hidden rounded-sm shadow-sm flex items-center justify-center border border-gray-100 bg-gray-50"
        style={{ width, height }}
      >
        <ReactCountryFlag
          countryCode={code}
          svg
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          title={countryName}
        />
      </div>
      {showName && <span className="text-xs text-gray-700">{countryName}</span>}
    </div>
  );
}

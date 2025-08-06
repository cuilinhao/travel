import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="text-white/70" size={16} />
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="en" className="bg-gray-800 text-white">English</option>
        <option value="zh" className="bg-gray-800 text-white">中文</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
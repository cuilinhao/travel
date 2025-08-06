import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en'); // 默认英语

  useEffect(() => {
    // 从 localStorage 获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { language, changeLanguage, t };
};
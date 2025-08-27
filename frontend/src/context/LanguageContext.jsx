import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

// eslint-disable-next-line react/prop-types
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    // Optional: persist language in localStorage
    localStorage.setItem('lang', langCode);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

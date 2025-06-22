
import { useState, useEffect } from 'react';

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
}

export function useCompanySettings() {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'NFMS Fleet Management',
    companyEmail: 'admin@noorcomfleet.co.ke',
    companyPhone: '+254 700 000 000',
    companyAddress: 'Nairobi, Kenya',
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('generalSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCompanySettings({
        companyName: settings.companyName || 'NFMS Fleet Management',
        companyEmail: settings.companyEmail || 'admin@noorcomfleet.co.ke',
        companyPhone: settings.companyPhone || '+254 700 000 000',
        companyAddress: settings.companyAddress || 'Nairobi, Kenya',
      });
    }
  }, []);

  // Listen for localStorage changes (when settings are saved)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('generalSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCompanySettings({
          companyName: settings.companyName || 'NFMS Fleet Management',
          companyEmail: settings.companyEmail || 'admin@noorcomfleet.co.ke',
          companyPhone: settings.companyPhone || '+254 700 000 000',
          companyAddress: settings.companyAddress || 'Nairobi, Kenya',
        });
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-window updates
    window.addEventListener('companySettingsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companySettingsUpdated', handleStorageChange);
    };
  }, []);

  return companySettings;
}

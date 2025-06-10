
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface IntegrationSettingsData {
  googleMapsEnabled: boolean;
  gpsTrackingEnabled: boolean;
  telematicsEnabled: boolean;
  googleApiKey: string;
  gpsEndpoint: string;
  telematicsProvider: string;
  telematicsApiKey: string;
  telematicsEndpoint: string;
}

export function useIntegrationSettings() {
  const [googleMapsEnabled, setGoogleMapsEnabled] = useState(true);
  const [gpsTrackingEnabled, setGpsTrackingEnabled] = useState(true);
  const [telematicsEnabled, setTelematicsEnabled] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('AIzaSyC***************');
  const [gpsEndpoint, setGpsEndpoint] = useState('wss://api.gpstrack.demo/v1/websocket');
  const [telematicsProvider, setTelematicsProvider] = useState('safaricom');
  const [telematicsApiKey, setTelematicsApiKey] = useState('');
  const [telematicsEndpoint, setTelematicsEndpoint] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('integrationSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setGoogleMapsEnabled(settings.googleMapsEnabled ?? true);
      setGpsTrackingEnabled(settings.gpsTrackingEnabled ?? true);
      setTelematicsEnabled(settings.telematicsEnabled ?? false);
      setGoogleApiKey(settings.googleApiKey ?? 'AIzaSyC***************');
      setGpsEndpoint(settings.gpsEndpoint ?? 'wss://api.gpstrack.demo/v1/websocket');
      setTelematicsProvider(settings.telematicsProvider ?? 'safaricom');
      setTelematicsApiKey(settings.telematicsApiKey ?? '');
      setTelematicsEndpoint(settings.telematicsEndpoint ?? '');
    }
  }, []);

  const saveIntegrationSettings = () => {
    const settings = {
      googleMapsEnabled,
      gpsTrackingEnabled,
      telematicsEnabled,
      googleApiKey,
      gpsEndpoint,
      telematicsProvider,
      telematicsApiKey,
      telematicsEndpoint
    };
    
    localStorage.setItem('integrationSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Integration settings have been saved successfully.",
    });
  };

  return {
    googleMapsEnabled,
    setGoogleMapsEnabled,
    gpsTrackingEnabled,
    setGpsTrackingEnabled,
    telematicsEnabled,
    setTelematicsEnabled,
    googleApiKey,
    setGoogleApiKey,
    gpsEndpoint,
    setGpsEndpoint,
    telematicsProvider,
    setTelematicsProvider,
    telematicsApiKey,
    setTelematicsApiKey,
    telematicsEndpoint,
    setTelematicsEndpoint,
    isConnecting,
    setIsConnecting,
    saveIntegrationSettings
  };
}

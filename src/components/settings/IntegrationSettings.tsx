
import React from 'react';
import { Button } from '@/components/ui/button';
import { gpsTrackingService } from '@/services/gpsTrackingService';
import { useToast } from '@/hooks/use-toast';
import { useIntegrationSettings } from '@/hooks/useIntegrationSettings';
import { TelematicsSettings } from './integrations/TelematicsSettings';
import { GPSMappingSettings } from './integrations/GPSMappingSettings';
import { FuelManagementSettings } from './integrations/FuelManagementSettings';
import { MaintenanceServiceSettings } from './integrations/MaintenanceServiceSettings';
import { DataExportSettings } from './integrations/DataExportSettings';

export function IntegrationSettings() {
  const {
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
  } = useIntegrationSettings();

  const { toast } = useToast();

  const testGpsConnection = async () => {
    setIsConnecting(true);
    try {
      gpsTrackingService.connect(gpsEndpoint);
      toast({
        title: "Connection Test",
        description: "GPS tracking service connection test completed.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to GPS tracking service.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <TelematicsSettings
        telematicsEnabled={telematicsEnabled}
        setTelematicsEnabled={setTelematicsEnabled}
        telematicsProvider={telematicsProvider}
        setTelematicsProvider={setTelematicsProvider}
        telematicsApiKey={telematicsApiKey}
        setTelematicsApiKey={setTelematicsApiKey}
        telematicsEndpoint={telematicsEndpoint}
        setTelematicsEndpoint={setTelematicsEndpoint}
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
      />

      <GPSMappingSettings
        googleMapsEnabled={googleMapsEnabled}
        setGoogleMapsEnabled={setGoogleMapsEnabled}
        gpsTrackingEnabled={gpsTrackingEnabled}
        setGpsTrackingEnabled={setGpsTrackingEnabled}
        googleApiKey={googleApiKey}
        setGoogleApiKey={setGoogleApiKey}
        gpsEndpoint={gpsEndpoint}
        setGpsEndpoint={setGpsEndpoint}
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
      />

      <FuelManagementSettings />

      <MaintenanceServiceSettings />

      <DataExportSettings />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={testGpsConnection} disabled={isConnecting}>
          Test Connections
        </Button>
        <Button onClick={saveIntegrationSettings}>Save Integration Settings</Button>
      </div>
    </div>
  );
}

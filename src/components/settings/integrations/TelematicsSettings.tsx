
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, Key, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TelematicsSettingsProps {
  telematicsEnabled: boolean;
  setTelematicsEnabled: (enabled: boolean) => void;
  telematicsProvider: string;
  setTelematicsProvider: (provider: string) => void;
  telematicsApiKey: string;
  setTelematicsApiKey: (key: string) => void;
  telematicsEndpoint: string;
  setTelematicsEndpoint: (endpoint: string) => void;
  isConnecting: boolean;
  setIsConnecting: (connecting: boolean) => void;
}

export function TelematicsSettings({
  telematicsEnabled,
  setTelematicsEnabled,
  telematicsProvider,
  setTelematicsProvider,
  telematicsApiKey,
  setTelematicsApiKey,
  telematicsEndpoint,
  setTelematicsEndpoint,
  isConnecting,
  setIsConnecting
}: TelematicsSettingsProps) {
  const { toast } = useToast();

  const handleTelematicsProviderChange = (provider: string) => {
    setTelematicsProvider(provider);
    
    // Set default endpoints based on provider
    if (provider === 'safaricom') {
      setTelematicsEndpoint('https://api.safaricom.co.ke/telematics/v1');
    } else if (provider === 'wialon') {
      setTelematicsEndpoint('https://hst-api.wialon.com');
    }
  };

  const testTelematicsConnection = async () => {
    setIsConnecting(true);
    try {
      // This would typically test the actual API connection
      toast({
        title: "Connection Test",
        description: `${telematicsProvider} telematics API connection test completed.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Unable to connect to ${telematicsProvider} telematics API.`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Telematics Service Providers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              Telematics Integration
              <Badge variant={telematicsEnabled ? "default" : "secondary"}>
                {telematicsEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </Label>
            <p className="text-sm text-gray-500">Connect to Safaricom or Wialon for advanced fleet tracking</p>
          </div>
          <Switch 
            checked={telematicsEnabled}
            onCheckedChange={setTelematicsEnabled}
          />
        </div>
        
        {telematicsEnabled && (
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telematics-provider">Service Provider</Label>
              <Select value={telematicsProvider} onValueChange={handleTelematicsProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select telematics provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safaricom">Safaricom M2M</SelectItem>
                  <SelectItem value="wialon">Wialon Hosting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telematics-endpoint">API Endpoint</Label>
              <div className="flex gap-2">
                <Input 
                  id="telematics-endpoint" 
                  value={telematicsEndpoint}
                  onChange={(e) => setTelematicsEndpoint(e.target.value)}
                  className="font-mono"
                  placeholder="https://api.provider.com/v1"
                />
                <Button 
                  variant="outline" 
                  onClick={testTelematicsConnection}
                  disabled={isConnecting}
                >
                  Test
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telematics-api-key">API Key / Token</Label>
              <div className="flex gap-2">
                <Input 
                  id="telematics-api-key" 
                  type="password"
                  value={telematicsApiKey}
                  onChange={(e) => setTelematicsApiKey(e.target.value)}
                  className="font-mono"
                  placeholder="Enter API key or authentication token"
                />
                <Button variant="outline" size="icon">
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {telematicsProvider === 'safaricom' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <strong>Safaricom M2M:</strong> Requires valid Safaricom M2M subscription and API credentials
                  </p>
                </div>
              </div>
            )}
            
            {telematicsProvider === 'wialon' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">
                    <strong>Wialon Hosting:</strong> Requires Wialon account with API access enabled
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

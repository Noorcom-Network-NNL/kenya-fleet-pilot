
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, Key, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { telematicsService } from '@/services/telematicsService';

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
    if (!telematicsApiKey || !telematicsEndpoint) {
      toast({
        title: "Missing Configuration",
        description: "Please provide both API key and endpoint before testing.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Configure the telematics service with current settings
      telematicsService.configure({
        provider: telematicsProvider as 'safaricom' | 'wialon',
        apiKey: telematicsApiKey,
        endpoint: telematicsEndpoint,
        enabled: true
      });

      // Test the connection
      const isConnected = await telematicsService.testConnection();
      
      if (isConnected) {
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${telematicsProvider} telematics API.`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: `Unable to connect to ${telematicsProvider} telematics API. Please check your credentials.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast({
        title: "Connection Error",
        description: `Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
                  disabled={isConnecting || !telematicsApiKey || !telematicsEndpoint}
                  className="flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Testing
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telematics-api-key">
                {telematicsProvider === 'wialon' ? 'Access Token' : 'API Key'}
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="telematics-api-key" 
                  type="password"
                  value={telematicsApiKey}
                  onChange={(e) => setTelematicsApiKey(e.target.value)}
                  className="font-mono"
                  placeholder={telematicsProvider === 'wialon' ? 
                    "Enter Wialon access token" : 
                    "Enter API key or authentication token"
                  }
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
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Wialon Hosting Setup:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Log into your Wialon account</li>
                      <li>Go to User Settings → Access tokens</li>
                      <li>Create a new token with required permissions</li>
                      <li>Copy the token and paste it above</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

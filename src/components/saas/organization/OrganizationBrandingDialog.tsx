
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrganizationCustomization } from '@/hooks/useOrganizationCustomization';
import { Organization } from '@/types/organization';
import { Palette, Upload } from 'lucide-react';

interface OrganizationBrandingDialogProps {
  showBrandingDialog: boolean;
  setShowBrandingDialog: (show: boolean) => void;
  selectedOrg: Organization | null;
}

export function OrganizationBrandingDialog({
  showBrandingDialog,
  setShowBrandingDialog,
  selectedOrg
}: OrganizationBrandingDialogProps) {
  const { customization, updateCustomization, loading } = useOrganizationCustomization(selectedOrg?.id);
  const [logoUrl, setLogoUrl] = useState(customization.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(customization.primaryColor || '#6366f1');
  const [welcomeMessage, setWelcomeMessage] = useState(customization.welcomeMessage || '');

  React.useEffect(() => {
    setLogoUrl(customization.logoUrl || '');
    setPrimaryColor(customization.primaryColor || '#6366f1');
    setWelcomeMessage(customization.welcomeMessage || '');
  }, [customization]);

  const handleSave = async () => {
    if (!selectedOrg) return;

    await updateCustomization(selectedOrg.id, {
      logoUrl: logoUrl.trim() || undefined,
      primaryColor: primaryColor || '#6366f1',
      welcomeMessage: welcomeMessage.trim() || undefined
    });

    setShowBrandingDialog(false);
  };

  const previewUrl = selectedOrg ? `/${selectedOrg.slug}/login` : '';

  return (
    <Dialog open={showBrandingDialog} onOpenChange={setShowBrandingDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Organization Branding - {selectedOrg?.name}
          </DialogTitle>
        </DialogHeader>
        
        {selectedOrg && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logoUrl"
                      placeholder="https://example.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#6366f1"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="Fleet Management System"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-center space-y-3">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="Logo preview"
                        className="h-8 w-auto mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-md mx-auto flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {selectedOrg.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h2 className="text-lg font-bold">{selectedOrg.name}</h2>
                    <p className="text-sm text-gray-600">
                      {welcomeMessage || 'Fleet Management System'}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Login URL:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {window.location.origin}{previewUrl}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowBrandingDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading}
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

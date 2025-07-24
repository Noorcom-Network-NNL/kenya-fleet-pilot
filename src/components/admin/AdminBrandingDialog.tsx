import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Palette, Save, Loader2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  custom_domain?: string;
  favicon_url?: string;
  custom_css?: string;
  white_label_enabled: boolean;
}

interface AdminBrandingDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AdminBrandingDialog({ organization, open, onOpenChange, onSuccess }: AdminBrandingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [brandingData, setBrandingData] = useState({
    primaryColor: organization?.primary_color || '#3b82f6',
    secondaryColor: organization?.secondary_color || '#1e40af',
    accentColor: organization?.accent_color || '#06b6d4',
    customDomain: organization?.custom_domain || '',
    customCss: organization?.custom_css || '',
    whiteLabelEnabled: organization?.white_label_enabled || false,
  });

  React.useEffect(() => {
    if (organization) {
      setBrandingData({
        primaryColor: organization.primary_color || '#3b82f6',
        secondaryColor: organization.secondary_color || '#1e40af',
        accentColor: organization.accent_color || '#06b6d4',
        customDomain: organization.custom_domain || '',
        customCss: organization.custom_css || '',
        whiteLabelEnabled: organization.white_label_enabled || false,
      });
    }
  }, [organization]);

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  const handleSave = async () => {
    if (!organization) return;

    try {
      setLoading(true);

      let logoUrl = organization.logo_url;
      let faviconUrl = organization.favicon_url;

      // Upload logo if selected
      if (logoFile) {
        const logoPath = `${organization.id}/logo.${logoFile.name.split('.').pop()}`;
        logoUrl = await uploadFile(logoFile, 'organization-logos', logoPath);
      }

      // Upload favicon if selected
      if (faviconFile) {
        const faviconPath = `${organization.id}/favicon.${faviconFile.name.split('.').pop()}`;
        faviconUrl = await uploadFile(faviconFile, 'organization-assets', faviconPath);
      }

      // Update organization with new branding
      const { error } = await supabase
        .from('organizations')
        .update({
          logo_url: logoUrl,
          favicon_url: faviconUrl,
          primary_color: brandingData.primaryColor,
          secondary_color: brandingData.secondaryColor,
          accent_color: brandingData.accentColor,
          custom_domain: brandingData.customDomain || null,
          custom_css: brandingData.customCss || null,
          white_label_enabled: brandingData.whiteLabelEnabled,
        })
        .eq('id', organization.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branding updated successfully",
      });

      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error updating branding:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update branding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Logo file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
    }
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          title: "Error",
          description: "Favicon file size must be less than 1MB",
          variant: "destructive",
        });
        return;
      }
      setFaviconFile(file);
    }
  };

  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White Label Branding - {organization.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* White Label Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">White Label Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whiteLabelEnabled">Enable White Labeling</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow this organization to customize branding
                  </p>
                </div>
                <Switch
                  id="whiteLabelEnabled"
                  checked={brandingData.whiteLabelEnabled}
                  onCheckedChange={(checked) => 
                    setBrandingData(prev => ({ ...prev, whiteLabelEnabled: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo and Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Logo</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    {organization.logo_url ? (
                      <img
                        src={organization.logo_url}
                        alt="Current logo"
                        className="w-16 h-16 mx-auto mb-2 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-2 bg-muted rounded flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {logoFile ? logoFile.name : 'Upload Logo'}
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    {organization.favicon_url ? (
                      <img
                        src={organization.favicon_url}
                        alt="Current favicon"
                        className="w-8 h-8 mx-auto mb-2 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded flex items-center justify-center">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      {faviconFile ? faviconFile.name : 'Upload Favicon'}
                    </Button>
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={brandingData.accentColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={brandingData.accentColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain and CSS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={brandingData.customDomain}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, customDomain: e.target.value }))}
                  placeholder="app.yourcompany.com"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default domain
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={brandingData.customCss}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, customCss: e.target.value }))}
                  placeholder="/* Custom CSS styles */"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Advanced styling customizations
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
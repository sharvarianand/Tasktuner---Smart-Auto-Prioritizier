import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useVoiceContext } from '@/contexts/VoiceContext';

const VoiceSettings: React.FC = () => {
  const { settings, updateSettings, availableVoices, isSupported } = useVoiceContext();

  const testVoice = () => {
    if (!isSupported || !settings.enabled) return;

    const utterance = new SpeechSynthesisUtterance(
      "This is a test of your voice settings. How do I sound? If you can hear this clearly, your settings are perfect!"
    );
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    if (settings.voice && availableVoices.length > 0) {
      const selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Voice notifications are not supported in your browser. Please try using a modern browser like Chrome, Edge, or Firefox.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {settings.enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Voice */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Voice Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Hear spoken notifications for tasks, reminders, and roasts
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Auto Speak */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Speak</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically speak new content like roasts and notifications
                </p>
              </div>
              <Switch
                checked={settings.autoSpeak}
                onCheckedChange={(checked) => updateSettings({ autoSpeak: checked })}
              />
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <Label>Voice</Label>
              <Select
                value={settings.voice || ''}
                onValueChange={(value) => updateSettings({ voice: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speech Rate */}
            <div className="space-y-2">
              <Label>Speech Rate: {settings.rate.toFixed(1)}x</Label>
              <Slider
                value={[settings.rate]}
                onValueChange={([value]) => updateSettings({ rate: value })}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-2">
              <Label>Pitch: {settings.pitch.toFixed(1)}</Label>
              <Slider
                value={[settings.pitch]}
                onValueChange={([value]) => updateSettings({ pitch: value })}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label>Volume: {Math.round(settings.volume * 100)}%</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={([value]) => updateSettings({ volume: value })}
                min={0.1}
                max={1.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quiet</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Test Button */}
            <Button onClick={testVoice} className="w-full" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Test Voice Settings
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;

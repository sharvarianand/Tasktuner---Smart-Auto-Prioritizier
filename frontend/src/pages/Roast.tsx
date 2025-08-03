import RoastGenerator from "@/components/RoastGenerator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { speakTaskNotification } from "@/hooks/useVoiceNotifications";
import Logo3D from "@/components/Logo3D";

const Roast = () => {
  const navigate = useNavigate();
  const { settings, toggleVoice } = useVoiceContext();

  const speakWelcome = () => {
    console.log('Testing voice with settings:', settings);
    if ('speechSynthesis' in window && settings.enabled) {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance("Welcome to TaskTuner's roast generator! Ready to get brutally honest about your productivity?");
      utterance.rate = settings.rate || 1;
      utterance.pitch = settings.pitch || 1;
      utterance.volume = settings.volume || 0.8;
      
      utterance.onstart = () => console.log('Welcome speech started');
      utterance.onend = () => console.log('Welcome speech ended');
      utterance.onerror = (event) => console.error('Welcome speech error:', event);
      
      console.log('Speaking welcome message...');
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Voice not enabled or not supported');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-3">
            {/* Voice Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className={`flex items-center gap-2 ${settings.enabled ? 'text-primary' : 'text-muted-foreground'}`}
              title={`Voice ${settings.enabled ? 'enabled' : 'disabled'}`}
            >
              {settings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Voice</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={speakWelcome}
              disabled={!settings.enabled}
              className="text-muted-foreground hover:text-primary"
              title="Test voice"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Test</span>
            </Button>

            <Logo3D 
              size="sm" 
              variant="primary" 
              animated={true} 
              showText={true}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 space-y-8">
        <RoastGenerator />
        
        {/* Voice Notification Demo */}
        {settings.enabled && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Voice Notification Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Try out voice notifications for different task scenarios:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakTaskNotification('taskCompleted', 'Write a blog post')}
                >
                  Task Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakTaskNotification('taskOverdue', 'Review project proposal')}
                >
                  Task Overdue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakTaskNotification('focusSessionStart', 25)}
                >
                  Focus Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakTaskNotification('streakAchieved', 7)}
                >
                  Streak Achieved
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakTaskNotification('motivationalPush')}
                  className="col-span-2"
                >
                  Motivational Push
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TaskTuner. Roasting procrastinators into productivity since today.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Roast;

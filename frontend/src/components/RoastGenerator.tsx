import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame, Zap, Target, Clock, RefreshCw, Volume2, VolumeX } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { useUser } from "@clerk/clerk-react";

const roasts = [
  {
    id: 1,
    message: "Still scrolling social media instead of being productive? Time to get your act together!",
    severity: "mild",
    icon: Clock
  },
  {
    id: 2,
    message: "Your to-do list is longer than a CVS receipt. Maybe it's time to actually DO something about it?",
    severity: "medium",
    icon: Target
  },
  {
    id: 3,
    message: "You've been 'planning to start tomorrow' for 47 tomorrows. Today IS tomorrow!",
    severity: "spicy",
    icon: Flame
  },
  {
    id: 4,
    message: "Your procrastination skills are Olympic-level. Too bad they don't give medals for that.",
    severity: "brutal",
    icon: Zap
  },
  {
    id: 5,
    message: "You know what's harder than starting? Explaining why you didn't start. Again.",
    severity: "medium",
    icon: Target
  },
  {
    id: 6,
    message: "Your future self called. They're disappointed but not surprised.",
    severity: "spicy",
    icon: Flame
  }
];

const RoastGenerator = () => {
  const { user } = useUser()
  
  // Get user's first name for personalized roasts
  const userName = user?.firstName || 'Champion'
  
  const [currentRoast, setCurrentRoast] = useState(roasts[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings, toggleVoice, availableVoices } = useVoiceContext();

  // Speech synthesis functions
  const speakRoast = (text: string) => {
    console.log('speakRoast called:', { text, enabled: settings.enabled, hasVoices: availableVoices.length });
    
    if ('speechSynthesis' in window && settings.enabled) {
      // Check if speech synthesis is available and not speaking
      if (window.speechSynthesis.speaking) {
        console.log('Already speaking, cancelling...');
        window.speechSynthesis.cancel();
      }
      
      // Small delay to ensure cancellation completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = settings.rate || 1;
        utterance.pitch = settings.pitch || 1;
        utterance.volume = settings.volume || 0.8;
        
        // Use selected voice from settings or find a good default
        let selectedVoice = null;
        const voices = window.speechSynthesis.getVoices();
        
        if (settings.voice && voices.length > 0) {
          selectedVoice = voices.find(voice => voice.name === settings.voice);
        }
        
        // If no voice selected or found, try to find a good default
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (
              voice.name.toLowerCase().includes('female') ||
              voice.name.toLowerCase().includes('samantha') ||
              voice.name.toLowerCase().includes('karen')
            )
          ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('Using voice:', selectedVoice.name);
        } else {
          console.log('No voice selected, using default');
        }

        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
          setIsSpeaking(false);
        };

        console.log('Starting speech synthesis...');
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Failed to start speech:', error);
          setIsSpeaking(false);
        }
      }, 100);
    } else {
      console.log('Speech not available or not enabled', {
        speechSynthesis: 'speechSynthesis' in window,
        enabled: settings.enabled
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const generateNewRoast = () => {
    setIsAnimating(true);
    stopSpeaking(); // Stop any current speech
    
    setTimeout(() => {
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setCurrentRoast(randomRoast);
      setIsAnimating(false);
      
      // Don't auto-speak - let user click "Speak This Roast" button manually
      // if (settings.enabled) {
      //   setTimeout(() => speakRoast(randomRoast.message), 100);
      // }
    }, 300);
  };

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.length);
      };
      
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // Force load voices with a small delay
      setTimeout(loadVoices, 100);
    }
  }, []);

  // Only auto-speak when user manually generates a new roast, not on component load
  // useEffect(() => {
  //   if (settings.enabled && !isAnimating && currentRoast.id !== roasts[0].id) {
  //     // Only auto-speak if it's not the initial roast
  //     console.log('Auto-speaking roast:', currentRoast.message);
  //     setTimeout(() => {
  //       speakRoast(currentRoast.message);
  //     }, 300);
  //   }
  // }, [currentRoast, settings.enabled, isAnimating]);

  // Remove the auto-generating interval that was causing continuous speech
  // useEffect(() => {
  //   const interval = setInterval(generateNewRoast, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "spicy": return "bg-orange-100 text-orange-800 border-orange-200";
      case "brutal": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "mild": return "🧊 Mild";
      case "medium": return "🌶️ Medium";
      case "spicy": return "🔥 Spicy";
      case "brutal": return "💀 Brutal";
      default: return "Roast";
    }
  };

  const IconComponent = currentRoast.icon;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Personalized Header */}
      {user && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready for some tough love, {userName}? 💪
          </h3>
          <p className="text-sm text-muted-foreground">
            Get the motivation you need to stop procrastinating and start achieving
          </p>
        </div>
      )}
      
      <motion.div
        key={currentRoast.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: isAnimating ? 0.5 : 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card border-border shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getSeverityColor(currentRoast.severity)} font-medium`}
            >
              {getSeverityLabel(currentRoast.severity)}
            </Badge>
          </CardHeader>
          <CardContent className="text-center space-y-6 px-6 pb-6">
            <blockquote className="text-xl font-medium text-card-foreground leading-relaxed">
              "{currentRoast.message}"
            </blockquote>
            
            <div className="flex flex-col gap-3 justify-center items-stretch">
              {/* First row - Get Another Roast and Voice controls */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={generateNewRoast}
                  disabled={isAnimating}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  glow
                  particles
                >
                  <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                  Get Another Roast
                </Button>

                <Button
                  variant="outline"
                  onClick={() => speakRoast(currentRoast.message)}
                  disabled={!settings.enabled || isSpeaking}
                  className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  glow
                  particles
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? 'Speaking...' : 'Speak This Roast'}
                </Button>

                <Button
                  variant="outline"
                  onClick={toggleVoice}
                  className={`flex items-center justify-center gap-2 flex-1 sm:flex-none ${settings.enabled ? 'bg-primary/10 text-primary border-primary' : ''}`}
                  glow
                  particles
                >
                  {settings.enabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Voice On
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      Voice Off
                    </>
                  )}
                </Button>
              </div>
              
              {/* Second row - Start Being Productive */}
              <div className="flex justify-center">
                <AuthButton 
                  buttonText="Start Being Productive"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  icon={<Zap className="w-4 h-4 mr-2" />}
                  glow
                  particles
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Ready to turn that roast into real results? Sign up to access the full TaskTuner experience!
        </p>
      </div>
    </div>
  );
};

export default RoastGenerator;

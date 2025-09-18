
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BotMessageSquare, Loader2, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { vistarionChat, type VistarionChatInput, type VistarionChatOutput } from '@/ai/flows/vistarion-chat';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ChatbotPage() {
  const { user, location } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: VistarionChatInput = {
        history: [...messages, userMessage],
        location: location || 'an unknown location'
      };
      
      const result = await vistarionChat(chatInput);

      const modelMessage: Message = { role: 'model', content: result.content };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: 'Error Communicating with Vistarion',
        description: 'Could not get a response. Please try again.',
        variant: 'destructive',
      });
      // Remove the user's message if the API call fails to allow them to retry.
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
       <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
            <BotMessageSquare className="h-8 w-8"/> Vistarion AI Chat
        </h1>
        <p className="text-muted-foreground">Your personal AI travel assistant for {location}. Ask me anything!</p>
      </header>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarFallback>
                        <Sparkles className="text-primary"/>
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xl rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(message.content) as string }}
                  />
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                     <Avatar className="h-9 w-9 border-2 border-primary/50">
                        <AvatarFallback>
                            <Sparkles className="text-primary"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-muted px-4 py-3">
                       <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="border-t bg-card p-4">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Ask about places, food, or safety tips..."
              className="pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

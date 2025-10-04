"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Send, Loader2, Cloud, Sparkles, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        model: selectedModel,
        webSearch: false,
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const suggestedQuestions = [
    "What's the weather probability for New York on December 25, 2026?",
    "Should I plan an outdoor wedding in Paris on May 20, 2027?",
    "Give me weather stats for Cairo (30.04, 31.24) on August 15, 2026",
    "What are the chances of rain in Tokyo on July 4, 2026?",
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <Cloud className="h-6 w-6" />
                <span className="text-xl font-bold">ORBIT</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">AI Weather Assistant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Card */}
        {messages.length === 0 && (
          <div className="mb-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Cloud className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chat with ORBIT AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Ask me about weather probabilities for any location and date
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                I analyze 30 years of NASA historical data (1995-2025)
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground">
                Try asking:
              </p>
              <div className="grid gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    onClick={() => handleSuggestionClick(question)}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">30 Years of Data</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Historical patterns for accurate predictions
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Any Location</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Worldwide coverage with NASA data
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center">
                  <Sparkles className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">AI-Powered</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Natural language understanding
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <Card className="mb-4 shadow-lg">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600">
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.parts.map((part, partIndex) => {
                          if (part.type === "text") {
                            return <span key={partIndex}>{part.text}</span>;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-gray-200 dark:bg-gray-700">
                        <AvatarFallback className="bg-transparent text-xs">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600">
                      <AvatarFallback className="bg-transparent text-white text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about weather probabilities for any location and date..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Example: &quot;What&apos;s the weather like in Cairo (30.04,
              31.24) on June 15, 2026?&quot;
            </p>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            ORBIT analyzes historical weather patterns to help you plan future
            events
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Data source: NASA POWER • 30 years of historical data (1995-2025)
          </p>
        </div>
      </div>
    </div>
  );
}

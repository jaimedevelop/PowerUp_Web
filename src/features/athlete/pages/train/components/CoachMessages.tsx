import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Phone, Video, MoreHorizontal } from "lucide-react";

interface Message {
  id: string;
  sender: "coach" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image" | "video";
}

type Props = { className?: string };

export const CoachMessages: React.FC<Props> = ({ className = "" }) => {
  const [messageText, setMessageText] = useState("");
  const [messages] = useState<Message[]>([
    { id: "1", sender: "coach", content: "Great work on yesterday's squat session! Your depth looked perfect on all reps.", timestamp: "2:30 PM", type: "text" },
    { id: "2", sender: "user",  content: "Thanks! Felt really solid. Ready for tomorrow's bench work.", timestamp: "2:45 PM", type: "text" },
    { id: "3", sender: "coach", content: "Perfect! Let's aim for 3x3 at 185. Focus on pausing each rep for a full count.", timestamp: "3:00 PM", type: "text" },
    { id: "4", sender: "user",  content: "Got it. Should I warm up the same way as last time?", timestamp: "3:05 PM", type: "text" },
    { id: "5", sender: "coach", content: "Yes, same warm-up protocol. Bar x 10, 95x8, 135x5, 155x3, then your working sets.", timestamp: "3:10 PM", type: "text" },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    // send...
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 flex items-center justify-center">
              <span className="text-white font-semibold">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Coach Sarah</h3>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors"><Phone className="w-5 h-5 text-slate-400" /></button>
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors"><Video className="w-5 h-5 text-slate-400" /></button>
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${m.sender === "user" ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-200"}`}>
              <p className="text-sm">{m.content}</p>
              <p className={`text-xs mt-1 ${m.sender === "user" ? "text-purple-200" : "text-slate-400"}`}>{m.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

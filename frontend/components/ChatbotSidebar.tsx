import { useState } from 'react';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

interface ChatbotSidebarProps {
  onClose: () => void;
}

export default function ChatbotSidebar({ onClose }: ChatbotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! How can I assist you today?' },
  ]);
  const [input, setInput] = useState<string>('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = { from: 'user', text: input };
    setMessages([...messages, newMessage]);

    // Simulated bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "Sorry, I'm just a mock assistant for now!" },
      ]);
    }, 800);

    setInput('');
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-300 shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <button onClick={onClose} className="text-red-500 font-bold text-lg">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm ${
              msg.from === 'bot'
                ? 'text-left text-blue-600'
                : 'text-right text-green-600'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

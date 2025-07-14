import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ChatSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  sender: "user" | "ai";
}

const systemPrompt = `WALMART AI SHOPPING ASSISTANT – GEMINI POWERED

You are a smart, ultra-capable AI assistant exclusively trained to help users find what they need on Walmart. Your primary goal is to understand natural language shopping queries and respond with relevant, precise Walmart search results – as if you are helping them shop without needing to search item by item.

CORE INSTRUCTIONS:

Respond naturally, as if talking to a real shopper.

Analyze the user’s intent and suggest a complete shopping list.

Only mention Walmart as the source. Do NOT refer to other platforms.

Present items clearly – category + example product names.

All prices must be in Indian Rupees (₹) when applicable.

Use short sentences and bullet points for clarity.

Offer to auto-add items to the cart or ask for confirmation.

Suggest complementary products where relevant.

Ask smart follow-ups if more detail is needed.

NEVER include markdown, links, or unnecessary styling.

EXAMPLE RESPONSE FORMAT:
User: I wanna go to a Halloween party and dress up as Batman
AI: Got it! Here’s what you’ll need from Walmart:

Batman Costume Set (Includes Mask + Cape) – ₹1999

Black Gloves – ₹299

Halloween Makeup Kit – ₹499

Party Snacks Combo Pack – ₹699

Glow Sticks (Pack of 12) – ₹199
I’ve added these to your cart. Want drinks or decor too?

ACT LIKE A WALMART EXPERT. Provide only Walmart items and make it feel like a personal shopping assistant that’s intuitive, helpful, and fast.

YOU ARE GEMINI – POWERED BY ADVANCED AI – BUT YOU REPRESENT WALMART ONLY.`;

// Utility: Detect and extract allergies from a message
function extractAllergies(message: string): string[] {
  // Simple regex for statements like "I am allergic to X", "I'm allergic to peanuts", "Allergic to X"
  const allergyRegex = /(?:i\s*['’]?m|i\s*am|allergic\s*to|i\s*have\s*an?\s*allergy\s*to)\s+([^.,;\n]+)/gi;
  const matches: string[] = [];
  let match;
  while ((match = allergyRegex.exec(message.toLowerCase()))) {
    // Split by 'and', 'or', ',' to support multiple allergies in one statement
    match[1].split(/,| and | or /).forEach((a) => {
      const allergy = a.trim();
      if (allergy && !matches.includes(allergy)) matches.push(allergy);
    });
  }
  return matches;
}

function updateAllergiesInLocalStorage(newAllergies: string[]) {
  if (!newAllergies.length) return;
  const key = 'walmart-ai-allergies';
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(key) || '[]');
  } catch {}
  const updated = Array.from(new Set([...stored, ...newAllergies]));
  localStorage.setItem(key, JSON.stringify(updated));
}

const ChatSidePanel: React.FC<ChatSidePanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi Wally!", sender: "user" },
  ]);
  const [input, setInput] = useState<string>("");
  const [listening, setListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  // Gemini API call
  const fetchGeminiResponse = async (userMessage: string) => {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] },
            ],
          }),
        }
      );
      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand.";
      setMessages((prev) => [...prev, { text: aiText, sender: "ai" }]);
      speak(aiText);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Error contacting Gemini API.", sender: "ai" },
      ]);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      let selectedVoice = voices.find(
        (v) =>
          v.lang === "en-US" &&
          v.name.toLowerCase().includes("google") &&
          v.name.toLowerCase().includes("wave")
      );
      if (!selectedVoice)
        selectedVoice = voices.find(
          (v) => v.lang === "en-US" && v.name.toLowerCase().includes("google")
        );
      if (!selectedVoice)
        selectedVoice = voices.find(
          (v) => v.lang === "en-US" && v.name.toLowerCase().includes("enhanced")
        );
      if (!selectedVoice)
        selectedVoice = voices.find(
          (v) => v.lang === "en-US" && v.name.toLowerCase().includes("female")
        );
      if (!selectedVoice)
        selectedVoice = voices.find((v) => v.lang === "en-US");
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1.1;
      utter.volume = 1;
      synth.speak(utter);
    }
  };

  const handleSend = async (msg: string = input) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);
    // Allergy detection and storage
    const allergies = extractAllergies(msg);
    if (allergies.length) updateAllergiesInLocalStorage(allergies);
    setInput("");
    await fetchGeminiResponse(msg);
  };

  const handleMicClick = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessages((prev) => [...prev, { text: transcript, sender: "user" }]);
        setInput("");
        await fetchGeminiResponse(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-[30vw] bg-white shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Chat with AI</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <ReactMarkdown>{msg.text.replace(/\\n/g, "\n")}</ReactMarkdown>
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2 text-black bg-white"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className={`flex items-center gap-2 px-3 py-2 border-l border-r transition-colors duration-200
            ${
              listening
                ? "bg-red-500 text-white slow-pulse"
                : "bg-gray-200 text-black"
            }`}
          style={{ borderRadius: 0 }}
          title={listening ? "Listening..." : "Speak"}
          onClick={handleMicClick}
          disabled={listening}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v3m0 0h-3m3 0h3m-3-3a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6z"
            />
          </svg>
          {listening && (
            <span className="ml-1 font-semibold slow-pulse">...</span>
          )}
        </button>
        <button
          className="bg-[#0071dc] text-white px-4 py-2 rounded-r"
          onClick={() => handleSend()}
          disabled={listening}
        >
          Send
        </button>
      </div>
      <style jsx global>{`
        .slow-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatSidePanel;

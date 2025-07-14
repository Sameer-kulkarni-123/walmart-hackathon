import React, { useState, useRef, useEffect } from "react";
import aiResponses from "./aiResponses.json";

interface ChatSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  sender: "user" | "ai";
}

const ChatSidePanel: React.FC<ChatSidePanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(
    [{ text: "Hi AI!", sender: "user" },
    { text: aiResponses[0], sender: "ai" }]
  );
  const [input, setInput] = useState<string>("");
  const [responseIndex, setResponseIndex] = useState<number>(1);
  const responseIndexRef = useRef<number>(responseIndex);
  const [listening, setListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    responseIndexRef.current = responseIndex;
  }, [responseIndex]);

  // Improved TTS for initial AI response
  useEffect(() => {
    if (isOpen) {
      const synth = window.speechSynthesis;
      const speakInitial = () => {
        if (messages.length === 2 && messages[1].sender === "ai") {
          speak(messages[1].text);
        }
      };
      if (synth && typeof synth.onvoiceschanged !== "undefined") {
        synth.onvoiceschanged = speakInitial;
      } else {
        speakInitial();
      }
    }
    // eslint-disable-next-line
  }, [isOpen, messages]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      // Try to select a more natural/enhanced voice
      let selectedVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("wave"));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("enhanced"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("female"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US");
      }
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1.1;
      utter.volume = 1;
      synth.speak(utter);
    }
  };

  const handleSend = (msg: string = input) => {
    if (!msg.trim()) return;

    let nextIndex = responseIndexRef.current;
    let aiMsg: Message | null = null;
    if (nextIndex < aiResponses.length) {
      aiMsg = { text: aiResponses[nextIndex], sender: "ai" };
      nextIndex++;
    }
    setMessages((prevMessages) => aiMsg ? [...prevMessages, { text: msg, sender: "user" }, aiMsg] : [...prevMessages, { text: msg, sender: "user" }]);
    setInput("");
    if (aiMsg) {
      setResponseIndex(nextIndex);
      responseIndexRef.current = nextIndex;
      speak(aiMsg.text);
    }
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;

        let nextIndex = responseIndexRef.current;
        let aiMsg: Message | null = null;
        if (nextIndex < aiResponses.length) {
          aiMsg = { text: aiResponses[nextIndex], sender: "ai" };
          nextIndex++;
        }
        setMessages((prevMessages) => aiMsg ? [...prevMessages, { text: transcript, sender: "user" }, aiMsg] : [...prevMessages, { text: transcript, sender: "user" }]);
        setInput("");
        if (aiMsg) {
          setResponseIndex(nextIndex);
          responseIndexRef.current = nextIndex;
          speak(aiMsg.text);
        }

        setListening(false);
        setInput("");
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    setListening(true);
    recognitionRef.current.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-90 bg-white shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Chat with AI</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2 text-black bg-white"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <button
          className={`bg-gray-200 text-black px-3 py-2 border-l border-r ${listening ? "animate-pulse" : ""}`}
          style={{ borderRadius: 0 }}
          title={listening ? "Listening..." : "Speak"}
          onClick={handleMicClick}
          disabled={listening}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3m0 0h-3m3 0h3m-3-3a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6z" />
          </svg>
        </button>
        <button className="bg-[#0071dc] text-white px-4 py-2 rounded-r" onClick={() => handleSend()} disabled={listening}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSidePanel;

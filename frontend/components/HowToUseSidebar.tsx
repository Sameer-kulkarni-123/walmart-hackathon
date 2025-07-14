import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Product } from "@/typings/productTypings";

interface HowToUseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

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

const HowToUseSidebar: React.FC<HowToUseSidebarProps> = ({ isOpen, onClose, product }) => {
  const [messages, setMessages] = useState<{ text: string; sender: "ai" | "user" }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchGeminiInstructions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product]);

  const fetchGeminiInstructions = async () => {
    setLoading(true);
    setMessages([]);
    const prompt = `You are a helpful Walmart assistant. The user has just bought the following product from Walmart.\n\nProduct Name: ${product?.title}\nDescription: ${product?.description}\n\nPlease provide clear, step-by-step instructions on how to use this product after purchase. Make it concise, friendly, and easy to follow. Use bullet points or short steps. Do not include markdown, links, or unnecessary styling. Only provide the instructions.`;
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyCldPlHrXsPyOLDOx1Z-9dwjaUH0bxrRQQ",
          },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: prompt }] },
            ],
          }),
        }
      );
      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get instructions.";
      setMessages([{ text: aiText, sender: "ai" }]);
    } catch (err) {
      setMessages([{ text: "Error contacting Gemini API.", sender: "ai" }]);
    }
    setLoading(false);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-full max-w-[30vw] bg-white shadow-2xl z-50 flex flex-col animate-slide-in rounded-l-2xl border-l border-blue-200">
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#e3f0ff] via-[#6ec1e4] to-[#ffe600] rounded-t-2xl">
        <div className="flex items-center gap-2">
          <img
            src="https://1000logos.net/wp-content/uploads/2017/05/Walmart-logo.png"
            alt="Walmart"
            className="h-7 w-7 drop-shadow bg-white rounded"
            style={{ objectFit: "contain" }}
            onError={e => {
              (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Walmart_logo.svg";
            }}
          />
          <h2 className="text-lg font-bold text-black">
            How to Use:{" "}
            <span className="font-normal text-black">{product.title}</span>
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-white bg-[#0071dc] hover:bg-[#ffe600] hover:text-[#0071dc] rounded-lg p-2 transition-colors duration-200 text-2xl focus:outline-none focus:ring-2 focus:ring-[#ffe600]"
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-white hide-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="animate-spin h-8 w-8 text-blue-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-blue-700 font-semibold">Loading instructions...</span>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-4 flex justify-start items-center">
              <span className="block bg-[#f7fafc] shadow px-4 py-3 rounded-xl text-gray-800 text-base leading-relaxed whitespace-pre-line flex-1">
                <ReactMarkdown>{msg.text.replace(/\\n/g, "\n")}</ReactMarkdown>
              </span>
              <button
                className="ml-2 text-[#0071dc] hover:text-[#ffe600] bg-white rounded-full p-2 shadow transition-colors"
                title="Listen to instructions"
                onClick={() => speak(msg.text.replace(/\\n/g, "\n"))}
              >
                🔊
              </button>
            </div>
          ))
        )}
      </div>
      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default HowToUseSidebar;
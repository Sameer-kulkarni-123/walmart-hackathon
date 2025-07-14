import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Product } from "@/typings/productTypings";

interface HowToUseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

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
    <div className="absolute top-0 right-0 h-full w-full max-w-[30vw] bg-white shadow-lg z-50 flex flex-col animate-slide-in">
      <div className="flex justify-between items-center p-4 border-b bg-walmart text-white">
        <h2 className="text-lg font-bold">How to Use: {product.title}</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">✕</button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="text-center text-walmart font-semibold">Loading instructions...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                <ReactMarkdown>{msg.text.replace(/\\n/g, "\n")}</ReactMarkdown>
              </span>
            </div>
          ))
        )}
      </div>
      <style jsx global>{`
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
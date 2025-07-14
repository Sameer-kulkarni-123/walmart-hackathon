'use client';

import { useState } from 'react';
import GridOption from '@/components/GridOption';
import ChatbotSidebar from '@/components/ChatbotSidebar';

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <main className="flex flex-1 relative">
      {/* Sidebar toggle button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        🧠 Open AI Assistant
      </button>

      {/* Chatbot sidebar */}
      <ChatbotSidebar isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Grid content */}
      <div className="grid grid-cols-1 grid-flow-row-dense md:grid-cols-4 gap-6 m-6 w-full">
        <GridOption
          title="Sweet gifts for less"
          image="https://links.papareact.com/1dy"
          className="bg-pink-200 h-full md:h-32"
        />
        <GridOption
          title="Shop Wardrobe"
          image="https://links.papareact.com/8ko"
          className="bg-blue-100 col-span-2 row-span-2"
        />
        <GridOption
          title="Shop Home"
          image="https://links.papareact.com/szu"
          className="bg-pink-200 row-span-2"
        />
        <GridOption
          title="Shop Electronics"
          image="https://links.papareact.com/n7r"
          className="bg-yellow-100 h-64"
        />
        <GridOption
          title="Shop Toys"
          image="https://links.papareact.com/pj2"
          className="bg-green-100 h-64 col-span-2"
        />
        <GridOption
          title="All you need for Match Day"
          image="https://links.papareact.com/m8e"
          className="bg-red-100 col-span-2 row-span-2"
        />
        <GridOption
          title="Shop Gadgets"
          image="https://links.papareact.com/gs1"
          className="bg-orange-100 h-64"
        />
        <GridOption
          title="Shop Beauty"
          image="https://links.papareact.com/4y0"
          className="bg-blue-100 h-64"
        />
        <GridOption
          title="Shop Sports"
          image="https://links.papareact.com/sq2"
          className="bg-lime-100 h-64"
        />
        <GridOption
          title="Enjoy Free Shipping"
          image="https://links.papareact.com/9fh"
          className="bg-rose-100 h-64"
        />
        <GridOption
          title="Flash Deals"
          image="https://links.papareact.com/qx7"
          className="bg-orange-200 h-64 col-span-2"
        />
      </div>
    </main>
  );
}

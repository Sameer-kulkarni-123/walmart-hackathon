interface SidebarProps {
  onAIAssistantClick: () => void;
}

export default function Sidebar({ onAIAssistantClick }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Walmart Clone</h2>
      <ul className="space-y-4">
        {/* Other links */}
        <li>
          <button
            onClick={onAIAssistantClick}
            className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
          >
            🧠 AI Assistant
          </button>
        </li>
      </ul>
    </div>
  );
}

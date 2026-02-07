import { useState } from 'react';
import { Search, Plus, BarChart3, BookOpen } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';

export default function Header() {
  const { searchQuery, setSearchQuery, addTopic, getStats } = useSheetStore();
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const stats = getStats();

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      addTopic(newTopicName.trim());
      setNewTopicName('');
      setShowAddTopic(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Question Sheet</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Striver SDE Sheet</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 size={16} className="text-indigo-500" />
              <span className="font-medium">{stats.solved}/{stats.total}</span>
              <span className="text-gray-400">solved</span>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-indigo-600">{stats.percentage}%</span>
          </div>

          {/* Search & Add */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowAddTopic(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Topic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddTopic(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Topic</h2>
            <form onSubmit={handleAddTopic}>
              <input
                type="text"
                placeholder="Topic name..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

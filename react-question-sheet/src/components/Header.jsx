import { useState } from 'react';
import { Search, Plus, BarChart3, BookOpen, X, Sparkles } from 'lucide-react';
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
    <header className="relative">
      {/* Dark gradient background */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)' }}
      >
        {/* Decorative glow spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-96 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a5b4fc, transparent 70%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row */}
          <div className="flex items-center justify-between pt-7 pb-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 text-white p-3 rounded-2xl border border-white/10">
                <BookOpen size={26} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Question Sheet</h1>
                <p className="text-indigo-300 text-sm mt-0.5">Striver SDE Sheet</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddTopic(true)}
              className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add Topic</span>
            </button>
          </div>

          {/* Stats bar */}
          <div className="pb-6">
            <div className="bg-white/[0.08] rounded-2xl px-5 py-4 border border-white/[0.08]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-5 flex-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-indigo-300" />
                    <span className="text-2xl font-bold text-white tabular-nums">{stats.solved}</span>
                    <span className="text-indigo-300 text-sm">/ {stats.total} solved</span>
                  </div>
                  <div className="hidden sm:block h-6 w-px bg-white/10" />
                  <div className="hidden sm:flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-300" />
                    <span className="text-white font-bold text-lg tabular-nums">{stats.percentage}%</span>
                    <span className="text-indigo-300 text-xs">complete</span>
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-10 py-2.5 text-sm bg-white/[0.07] border border-white/10 rounded-xl text-white placeholder-indigo-400/60 focus:outline-none focus:bg-white/[0.12] focus:border-indigo-400/40 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out relative"
                    style={{
                      width: `${stats.percentage}%`,
                      background: 'linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)',
                    }}
                  >
                    <div className="absolute inset-0 progress-shimmer rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddTopic(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <Plus size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Add New Topic</h2>
            </div>
            <form onSubmit={handleAddTopic}>
              <input
                type="text"
                placeholder="Enter topic name..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 placeholder-gray-400"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer active:scale-95"
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

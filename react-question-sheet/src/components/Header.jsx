import { useState, useRef } from 'react';
import { Search, Plus, BarChart3, BookOpen, X, Target, Download, Upload, ChevronsUpDown, RotateCcw } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const diffColors = {
  All: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  Easy: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  Hard: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
};
const diffActiveColors = {
  All: 'bg-slate-700 text-white ring-2 ring-slate-400/30',
  Easy: 'bg-emerald-600 text-white ring-2 ring-emerald-400/30',
  Medium: 'bg-amber-500 text-white ring-2 ring-amber-400/30',
  Hard: 'bg-rose-600 text-white ring-2 ring-rose-400/30',
};

export default function Header() {
  const {
    searchQuery, setSearchQuery,
    difficultyFilter, setDifficultyFilter,
    allExpanded, setAllExpanded,
    addTopic, getStats,
    exportData, importData, resetToSampleData,
  } = useSheetStore();
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);
  const stats = getStats();

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      addTopic(newTopicName.trim());
      setNewTopicName('');
      setShowAddTopic(false);
    }
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-sheet-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importData(ev.target.result);
      if (result.success) {
        setImportStatus('success');
      } else {
        setImportStatus('error');
      }
      setTimeout(() => setImportStatus(null), 2500);
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowMenu(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset to sample data? This will overwrite your current progress.')) {
      resetToSampleData();
      setShowMenu(false);
    }
  };

  return (
    <header>
      {/* Navigation bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white">
                <BookOpen size={18} />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Question Sheet</h1>
                <p className="text-xs text-slate-500 leading-tight">Striver SDE Sheet</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-52 pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* More menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Options"
                >
                  <ChevronsUpDown size={16} />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1 animate-slideUp">
                      <button
                        onClick={() => { setAllExpanded(!allExpanded); setShowMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      >
                        <ChevronsUpDown size={14} />
                        {allExpanded ? 'Collapse All' : 'Expand All'}
                      </button>
                      <button
                        onClick={handleExport}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      >
                        <Download size={14} />
                        Export JSON
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      >
                        <Upload size={14} />
                        Import JSON
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={handleReset}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                      >
                        <RotateCcw size={14} />
                        Reset to Sample
                      </button>
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              </div>

              <button
                onClick={() => setShowAddTopic(true)}
                className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer active:scale-[0.97] shadow-sm"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">Add Topic</span>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="pb-3 sm:hidden">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats + Filters bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900 tabular-nums">{stats.solved}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="tabular-nums">{stats.total}</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Target size={14} className="text-indigo-500" />
                <span className="text-sm font-bold text-indigo-600 tabular-nums">{stats.percentage}%</span>
              </div>
              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                <div
                  className="h-1.5 rounded-full transition-all duration-700 ease-out bg-indigo-500"
                  style={{ width: `${Math.max(stats.percentage, 1)}%` }}
                />
              </div>
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-all ${
                    difficultyFilter === d ? diffActiveColors[d] : diffColors[d]
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Import status toast */}
      {importStatus && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg animate-slideUp ${
          importStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {importStatus === 'success' ? 'Data imported successfully!' : 'Import failed — invalid file'}
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-[20vh] z-50 animate-fadeIn" onClick={() => setShowAddTopic(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border border-slate-200 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-bold text-slate-900 mb-4">New Topic</h2>
            <form onSubmit={handleAddTopic}>
              <input
                type="text"
                placeholder="Topic name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white placeholder-slate-400"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer active:scale-[0.97]"
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

import Header from './components/Header';
import TopicList from './components/TopicList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 relative">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <Header />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TopicList />
      </main>

      <footer className="relative text-center py-8 text-xs text-slate-400 border-t border-slate-100">
        <p>Interactive Question Sheet &mdash; Drag &amp; drop to reorder. Click to edit.</p>
        <p className="mt-1 text-slate-300">Built with React + Zustand + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;

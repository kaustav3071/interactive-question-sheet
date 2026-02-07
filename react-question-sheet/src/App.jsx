import Header from './components/Header';
import TopicList from './components/TopicList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TopicList />
      </main>
      <footer className="text-center py-6 text-xs text-gray-400">
        Interactive Question Sheet &mdash; Drag &amp; drop to reorder. Click to edit.
      </footer>
    </div>
  );
}

export default App;

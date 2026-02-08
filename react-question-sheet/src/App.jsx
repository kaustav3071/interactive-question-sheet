import Header from './components/Header';
import TopicList from './components/TopicList';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TopicList />
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        <p>Drag &amp; drop to reorder &middot; Click to edit &middot; Built with React</p>
      </footer>
    </div>
  );
}

export default App;

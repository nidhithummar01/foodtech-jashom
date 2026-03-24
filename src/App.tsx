import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-64">
        <Topbar />
        <main className="flex-1 p-6">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;

import { Navbar } from './components/Navbar';
import { DashboardSection } from './components/DashboardSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16">
        {/* Section 1: User Dashboard - Chat Interface */}
        <DashboardSection />

        {/* Section 2: Footer */}
        <Footer />
      </div>
    </div>
  );
}

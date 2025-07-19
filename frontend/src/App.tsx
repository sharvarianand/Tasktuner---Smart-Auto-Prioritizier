import { BrowserRouter, Routes, Route } from "react-router-dom"

// Simple test landing page
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">TaskTuner</h2>
                <p className="text-xs text-gray-400">Savage Productivity</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-slate-600 rounded-md hover:bg-slate-800 transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 inline-block px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm">
              🚀 The AI-Powered Productivity Revolution
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              TaskTuner
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              The AI-powered productivity app that <span className="text-orange-500 font-semibold">roasts you into action</span>
            </p>
            
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Smart auto-prioritization meets savage motivation. Let AI organize your chaos while GenZ humor keeps you accountable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="px-8 py-4 bg-orange-500 text-white rounded-lg text-lg hover:bg-orange-600 transition-colors shadow-lg">
                Start Being Productive ⚡
              </button>
              <button className="px-8 py-4 border border-slate-600 text-white rounded-lg text-lg hover:bg-slate-800 transition-colors">
                Watch Demo →
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">500K+</div>
                <div className="text-sm text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">95%</div>
                <div className="text-sm text-gray-400">Productivity Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500">4.9/5</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-bold">TaskTuner</h3>
                <p className="text-xs text-gray-400">Savage Productivity</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 TaskTuner. Made with ❤️ and a lot of sass.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const Dashboard = () => (
  <div className="min-h-screen bg-slate-900 text-white p-8">
    <h1 className="text-4xl font-bold text-orange-500">Dashboard</h1>
    <p className="text-gray-300 mt-4">Your productivity command center is coming soon!</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

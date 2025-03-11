import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import VideoCompressor from './components/VideoCompressor';
import VideoDownload from './components/VideoDownload';
import ProcessingEmail from './components/ProcessingEmail';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f1219] to-[#1a1f2e]">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<VideoCompressor />} />
              <Route path="/download/:id" element={<VideoDownload />} />
              <Route path="/processing-email" element={<ProcessingEmail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
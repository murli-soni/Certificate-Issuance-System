import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CourseList from './CourseList';
import CertificateEditor from './components/CertificateEditor';
import CertificatePreview from './components/CertificatePreview';
import {CoursesProvider}  from './context/CoursesContext';
import WebFont from 'webfontloader';
import './App.css';

function AppContent() {
  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <Routes>
        <Route path="/" element={<CourseList/>}/>
        <Route path="/edit/:courseId" element={<CertificateEditor />} />
        <Route path="/preview/:courseId" element={<CertificatePreview />} />
      </Routes>
    </div>
  );
}

function App() {
  WebFont.load({ google: { families: ['Droid Sans', 'Droid Serif'] } });

  return (
    <CoursesProvider>
      <Router>
        <div className="app">
          <Navbar />
          <AppContent />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </CoursesProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginOnboarding from './components/LoginOnboarding';
import EmployeeDashboard from './pages/EmployeeDashboard';
import RoadmapPage from './pages/RoadmapPage';
import AdminDashboard from './pages/AdminDashboard';
import QuizCenter from './pages/QuizCenter';
import CourseCatalog from './pages/CourseCatalog';
import ChatWidget from './components/ChatWidget';
import ProfileModal from './components/ProfileModal';
import DocumentUploadModal from './components/DocumentUploadModal';
import { fetchEmployees } from './services/api';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'roadmap', 'quizzes', 'courses', 'admin'
  const [activeRole, setActiveRole] = useState('employee'); // 'employee' or 'admin'
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [generatedDocQuiz, setGeneratedDocQuiz] = useState(null);

  useEffect(() => {
    async function init() {
      const emps = await fetchEmployees();
      setEmployees(emps);
      if (emps.length > 0) {
        setActiveEmployee(emps[0]);
      }
    }
    init();
  }, []);

  const handleLoginSuccess = (employee) => {
    setActiveEmployee(employee);
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleQuizGeneratedFromDoc = (quiz) => {
    setShowUploadModal(false);
    setGeneratedDocQuiz(quiz);
    setCurrentTab('quizzes');
  };

  const handleTriggerQuizFromChat = () => {
    setCurrentTab('quizzes');
  };

  // If not logged in, render the official Gov Login & Smart Onboarding Questionnaire first!
  if (!isLoggedIn) {
    return (
      <LoginOnboarding
        employees={employees}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral text-ink flex flex-col selection:bg-secondary/20">
      
      {/* Official Government Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        employees={employees}
        activeEmployee={activeEmployee}
        setActiveEmployee={setActiveEmployee}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <EmployeeDashboard
            activeEmployee={activeEmployee}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapPage
            activeEmployee={activeEmployee}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizCenter
            activeEmployee={activeEmployee}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onQuizCompletedGlobal={() => {
              // Quiz completed callback
            }}
          />
        )}

        {currentTab === 'courses' && (
          <CourseCatalog
            onEnrollSuccess={(item) => {
              console.log('Enrolled in:', item.title);
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          employee={activeEmployee}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Document Upload / AI Quiz Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          employeeId={activeEmployee?.id || 1}
          onQuizGenerated={handleQuizGeneratedFromDoc}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* Floating Karmayogi Statistical Assistant */}
      <ChatWidget
        activeEmployee={activeEmployee}
        onTriggerQuiz={handleTriggerQuizFromChat}
        onOpenTab={(tab) => setCurrentTab(tab)}
      />

      {/* Official GovTech Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="font-bold text-primary">सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय</span>
            <span>|</span>
            <span>Ministry of Statistics and Programme Implementation</span>
          </div>
          <p className="font-mono text-[11px] text-secondary">
            Smart India Hackathon 2026 · Problem Statement 26101 · National Competency Framework
          </p>
        </div>
      </footer>

    </div>
  );
}

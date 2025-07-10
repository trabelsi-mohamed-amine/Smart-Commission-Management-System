import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Services
import meetingNotificationService from './services/MeetingNotificationService';


// Layouts
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';

// Guards
import RoleGuard from './components/RoleGuard';

// Pages publiques
import Carousel from './components/Carousel';
import Services from './components/Services';
import About from './components/About';
import Categories from './components/Categories';
import Service from './components/Service';
import Team from './components/Team';
import Testimonial from './components/Testimonial';
import AboutPage from './pages/AboutPage';
import ServicePage from './pages/ServicePage';

import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages dashboard
import Dashboard from './pages/Dashboard';
import Commissions from './pages/Commissions';
import Meetings from './pages/Meetings';
import OrderOfDay from './pages/OrderOfDay';
import MeetingTranscript from './pages/MeetingTranscript';
import MeetingCalendar from './components/MeetingCalendar';
import Modules from './pages/Modules';
import Typologies from './pages/Typologies';
import Teams from './pages/Teams';
import Logout from './pages/Logout';
import AdminContactsPage from './pages/AdminContactsPage';
import UserManagement from './pages/UserManagement';
import MyCommissions from './pages/MyCommissions';
import ChatbotAI from './pages/ChatbotAI';


const Home = () => (
  <>
    <Carousel />
    <Services />
    <About />
    <Categories />
    <Service />
    <Team />
    <Testimonial />
  </>
);

function App() {
  // Initialize meeting notification service
  useEffect(() => {
    // Initialize the service with a 10-minute check interval
    meetingNotificationService.init({
      interval: 10 * 60 * 1000 // 10 minutes
    });
    
    console.log('Meeting notification service initialized from App component');
    
    // Request notification permission for browser notifications
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Layout - Shared */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="logout" element={<Logout />} />
          
          {/* Routes accessible to all authenticated users */}
          <Route path="meeting-transcript/:id" element={<MeetingTranscript />} />
          <Route path="transcripts" element={<Meetings />} />
          
          {/* Administrator Routes */}
          <Route element={<RoleGuard allowedRoles={['administrator']} />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="modules" element={<Modules />} />
            <Route path="typologies" element={<Typologies />} />
            <Route path="teams" element={<Teams />} />
            <Route path="contacts" element={<AdminContactsPage />} />
          </Route>
          
          {/* Commission Manager Routes */}
          <Route element={<RoleGuard allowedRoles={['administrator', 'commission_manager']} />}>
            <Route path="meetings" element={<Meetings />} />
            <Route path="commissions/:commissionId/order-of-day" element={<OrderOfDay />} />
          </Route>
          
          {/* Commission Member Routes */}
          <Route element={<RoleGuard allowedRoles={['administrator', 'commission_member']} />}>
            <Route path="commissions/view" element={<Commissions />} />
          </Route>
          
          {/* Calendar Routes - accessible to all role types */}
          <Route element={<RoleGuard allowedRoles={['administrator', 'commission_manager', 'commission_member']} />}>
            <Route path="meetings/calendar" element={<MeetingCalendar />} />
          </Route>
          
          {/* Routes for both Commission Members and Commission Managers */}
          <Route element={<RoleGuard allowedRoles={['administrator', 'commission_manager', 'commission_member']} />}>
            <Route path="my-commissions" element={<MyCommissions />} />
          </Route>

          {/* Routes accessible to all authenticated users */}
          <Route element={<RoleGuard allowedRoles={['administrator', 'commission_manager', 'commission_member']} />}>
            <Route path="meeting-transcript/:id" element={<MeetingTranscript />} />
            <Route path="help-assistant" element={<ChatbotAI />} />
          </Route>
          
         
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;

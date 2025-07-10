import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaCalendar,
  FaFileAlt,
  FaCogs,
  FaThList,
  FaEnvelope,
  FaUserShield,
  FaListAlt,
  FaRobot
} from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
        // Define menu items based on user role
      const baseMenuItems = [
        { label: 'Dashboard', to: '/dashboard', icon: <FaHome />, roles: ['administrator', 'commission_member', 'commission_manager'] },
        { label: 'Help Assistant', to: '/dashboard/help-assistant', icon: <FaRobot />, roles: ['administrator', 'commission_member', 'commission_manager'] },
      ];
        // Admin-specific menu items     
         const adminMenuItems = [
        { label: 'User Management', to: '/dashboard/users', icon: <FaUserShield />, roles: ['administrator'] },
        { label: 'Commissions', to: '/dashboard/commissions', icon: <FaUsers />, roles: ['administrator'] },
        { label: 'Modules', to: '/dashboard/modules', icon: <FaCogs />, roles: ['administrator'] },
        { label: 'Typologies', to: '/dashboard/typologies', icon: <FaThList />, roles: ['administrator'] },
        { label: 'Contact Messages', to: '/dashboard/contacts', icon: <FaEnvelope />, roles: ['administrator'] },
      ];
        // Commission manager menu items
      const managerMenuItems = [
        { label: 'Meetings', to: '/dashboard/meetings', icon: <FaCalendar />, roles: ['administrator', 'commission_manager'] },
        { label: 'My Commissions', to: '/dashboard/my-commissions', icon: <FaListAlt />, roles: ['commission_manager'] },
      ];
      
      // Commission member menu items
      const memberMenuItems = [
        { label: 'View All Commissions', to: '/dashboard/commissions/view', icon: <FaUsers />, roles: ['commission_member'] },
        { label: 'My Commissions', to: '/dashboard/my-commissions', icon: <FaUsers />, roles: ['commission_member'] },
        { label: 'Meeting Calendar', to: '/dashboard/meetings/calendar', icon: <FaCalendar />, roles: ['administrator', 'commission_member', 'commission_manager'] },
        { label: 'Transcripts', to: '/dashboard/transcripts', icon: <FaFileAlt />, roles: ['commission_member'] },
      ];
      
      // Combine all menu items and filter based on role
      const allMenuItems = [...baseMenuItems, ...adminMenuItems, ...managerMenuItems, ...memberMenuItems];
      const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(user.role));
      
      setMenuItems(filteredMenuItems);
    }
  }, []);

  return (
    <div className="sidebar-fixed">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="brand-logo">SM</div>
          <h4 className="brand-text">SmartMeet</h4>
          <div className="role-badge">
            <span>{userRole ? userRole.replace('_', ' ').toUpperCase() : ''}</span>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.to} className="nav-item">
                <Link
                  to={item.to}
                  className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

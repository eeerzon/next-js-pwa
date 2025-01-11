'use client';

import { useNavigate } from 'react-router-dom';




const Sidebar = ({ isDarkMode, toggle, setCollapsed, collapsed }) => {
    const navigate = useNavigate();
  
    return (
      <div
        className={`fixed h-full bg-gray-200 dark:bg-gray-700 transition-all ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-800 dark:text-white"
        >
          {collapsed ? '>' : '<'}
        </button>
        <div className={`${collapsed ? 'hidden' : ''} mt-4`}>
          <button
            onClick={toggle}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full px-4 py-2 text-left text-gray-800 dark:text-white"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/add-customer')}
              className="block w-full px-4 py-2 text-left text-gray-800 dark:text-white"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
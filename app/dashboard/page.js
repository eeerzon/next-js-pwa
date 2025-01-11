'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useDarkMode } from 'usehooks-ts';
import { format } from 'date-fns';

const Sidebar = ({ isDarkMode, toggle, setCollapsed, collapsed }) => (
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
          onClick={() => router.push('/dashboard')}
          className="block w-full px-4 py-2 text-left text-gray-800 dark:text-white"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push('/add-customer')}
          className="block w-full px-4 py-2 text-left text-gray-800 dark:text-white"
        >
          Add Customer
        </button>
      </div>
    </div>
  </div>
);

// type Customer = {
//   id: number;
//   full_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   brith_date: string;
//   nationality: string;
//   country?: string;
//   photo_url?: string;
//   created_at: string;
//   updated_at: string;
// };

// /**
//  * @typedef {Object} Customer
//  * @property {number} id - Unique identifier for the customer
//  * @property {string} fullName - Full name of the customer
//  * @property {string} email - Email address of the customer
//  * @property {string} phone - Phone number of the customer
//  * @property {string} address - Address of the customer
//  * @property {string} dob - Date of birth of the customer
//  * @property {string} nationality - Nationality of the customer
//  * @property {string} [country] - Country of the customer (optional)
//  * @property {string} [photoUrl] - Photo URL of the customer (optional)
//  * @property {string} createdAt - Creation date of the customer record
//  */

const Dashboard = () => {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();
  // const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    nationality: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 5;
  const [collapsed, setCollapsed] = useState(false);
  const [Customer, setFormData] = useState({
    id: 0,
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: new Date(),
    nationality: 'WNI',
    country: '',
    photo_url: '',
    created_at: '',
    update_at: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filters]);

  const fetchCustomers = async () => {
    setLoading(true);

    let query = supabase
      .from('customers')
      .select('*')
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

    if (filters.search) {
      query = query.or(`fullName.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.nationality) {
      query = query.eq('nationality', filters.nationality);
    }

    if (filters.startDate) {
      query = query.gte('createdAt', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('createdAt', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      const validData = (data || []).map((customer) => ({
        ...customer,
        dob: customer.dob && !isNaN(new Date(customer.dob).getTime()) ? customer.dob : null,
        createdAt: customer.createdAt && !isNaN(new Date(customer.createdAt).getTime()) ? customer.createdAt : null,
      }));
      setCustomers(validData);
    }

    setLoading(false);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // const deleteCustomer = async (id: number) => {
  //   const { error } = await supabase.from('customers').delete().eq('id', id);
  //   if (error) {
  //     console.error('Error deleting customer:', error);
  //   } else {
  //     alert('Customer deleted successfully!');
  //     fetchCustomers();
  //   }
  // };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-white dark:bg-gray-800">
      <Sidebar
          isDarkMode={isDarkMode}
          toggle={toggle}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        />
        <div
          className={`flex-1 ml-${collapsed ? '16' : '64'} transition-all p-4`}
        >
          <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Customer List</h1>

          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name or email"
              className="input"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <select
              name="nationality"
              className="input"
              value={filters.nationality}
              onChange={handleFilterChange}
            >
              <option value="">All Nationalities</option>
              <option value="WNI">WNI</option>
              <option value="WNA">WNA</option>
            </select>
            <input
              type="date"
              name="startDate"
              className="input"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="input"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          {/* Customer Cards */}
          {loading ? (
            <p>Loading...</p>
          ) : customers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className={`card p-4 cursor-pointer shadow-md ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  } hover:shadow-lg transition duration-200`}
                >
                  <img
                    src={customer.photo_url}
                    alt={customer.full_name}
                    className="w-32 h-32 rounded-full mx-auto"
                  />
                  <h2 className="text-xl font-bold mt-4 text-center">
                    {customer.full_name}
                  </h2>
                  <p className="text-center">{customer.email}</p>
                  <p className="text-center">{customer.nationality}</p>
                  <p className="text-center text-sm">
                    DOB: {customer.brith_date ? format(new Date(customer.brith_date), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => router.push(`/customer-detail/${customer.id}`)}
                    >
                      Details
                    </button>
                    {/* <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      Delete
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No customers found.</p>
          )}

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <button
              className="btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <p>
              Page {currentPage}
            </p>
            <button
              className="btn-secondary"
              disabled={customers.length < itemsPerPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );

};

export default CustomerForm;
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useDarkMode } from 'usehooks-ts';
import { format } from 'date-fns';
import Sidebar from '@/app/components/Sidebar';

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
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 5;
  const [collapsed, setCollapsed] = useState(false);
  const [customers, setCustomers] = useState({
    id: "",
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
        birth_date: customer.birth_date && !isNaN(new Date(customer.birth_date).getTime()) ? customer.birth_date : null,
        created_at: customer.created_at && !isNaN(new Date(customer.created_at).getTime()) ? customer.created_at : null,
      }));
      setCustomers(validData);
    }

    
    console.log('data : ', customers);

    setLoading(false);
  };

  const handleNavigate = (id) => {
    window.customerID = id;

    // console.log('ID : ', id);

    router.push(`/customer-detail/${id}`)
  };

  
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

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
          className={`flex-1 transition-all duration-300 ease-in-out ${
            collapsed ? 'ml-16' : 'ml-64'
          } p-4`}
        >
          <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Customer List</h1>

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
              className="input text-gray-500"
              value={filters.nationality}
              onChange={handleFilterChange}
            >
              <option className="text-black" value="">All Nationalities</option>
              <option className="text-black" value="WNI">WNI</option>
              <option className="text-black" value="WNA">WNA</option>
            </select>
            <input
              type="date"
              name="startDate"
              className="input text-gray-500"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="input text-gray-500"
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
                  <h2 className="text-xl font-bold mt-4 text-center text-black dark:text-white">
                    {customer.full_name}
                  </h2>
                  <p className="text-center text-black dark:text-white">{customer.email}</p>
                  <p className="text-center text-black dark:text-white">{customer.nationality}</p>
                  <p className="text-center text-sm text-black dark:text-white">
                    DOB: {customer.brith_date ? format(new Date(customer.brith_date), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleNavigate(customer.id)}
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

export default Dashboard;
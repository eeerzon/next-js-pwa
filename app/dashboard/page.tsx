'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { format } from 'date-fns';

type Customer = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  brith_date: string;
  nationality: string;
  country?: string;
  photo_url?: string;
  created_at: string;
  update_at: string;
};

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


export default function Dashboard() {

    const router = useRouter();

    const navigateToMenu1 = () => {
      router.push('/dashboard'); // Ganti '/menu1' dengan rute yang sesuai
    };

  const navigateToMenu2 = () => {
    router.push('/customer-input'); // Ganti '/menu1' dengan rute yang sesuai
  };


  //code customer list
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    nationality: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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



  const deleteCustomer = async (id: number) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting customer:', error);
    } else {
      alert('Customer deleted successfully!');
      fetchCustomers();
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  //end of code




    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <aside className="w-64 bg-gray-800 text-white hidden md:block">
          <nav>
            <ul>
            <li className="p-4 cursor-pointer hover:bg-gray-700" onClick={navigateToMenu1}>
              Dashboard
            </li>
            <li className="p-4 cursor-pointer hover:bg-gray-700" onClick={navigateToMenu2}>
              Input Customer Data
            </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4">


        <div className="p-4">
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
          className="input text-gray-800"
          value={filters.nationality}
          onChange={handleFilterChange}
        >
          <option className="text-gray-800" value="">
            All Nationalities
          </option>
          <option className="text-gray-800" value="WNI">
            WNI
          </option>
          <option className="text-gray-800" value="WNA">
            WNA
          </option>
        </select>
        <input
          type="date"
          name="startDate"
          className="input text-gray-800"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          className="input text-gray-800"
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
            className="card bg-white shadow-md p-4 cursor-pointer hover:shadow-lg transition duration-200"
            // onClick={() => router.push(`/customer-detail/${customer.id}`)}
            > 
              <img
                src={customer.photo_url }
                alt={customer.full_name}
                className="w-32 h-32 rounded-full mx-auto"
              />
              <h2 className="text-xl font-bold mt-4 text-center">{customer.full_name}</h2>
              <p className="text-center text-gray-800">{customer.email}</p>
              <p className="text-center">{customer.nationality}</p>
              <p className="text-center text-sm text-gray-800">
                DOB: {customer.brith_date ? format(new Date(customer.brith_date), 'dd//MM/yyyy') : 'N/A'}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => alert(`Edit feature for ${customer.full_name} not implemented yet.`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => deleteCustomer(customer.id)}
                >
                  Delete
                </button>
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
          Page {currentPage} / {Math.ceil(customers.length / itemsPerPage)}
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


        </main>
      </div>
    );
  }
  
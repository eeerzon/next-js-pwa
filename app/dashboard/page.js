'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  nationality: string;
  country?: string;
  photoUrl?: string;
  createdAt: string;
};


export default function Dashboard() {

    const router = useRouter();

  const navigateToMenu1 = () => {
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
      setCustomers(data || []);
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
              Input Customer Data
            </li>
              <li className="p-4">Menu 2</li>
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
            <div key={customer.id} className="card bg-white shadow-md p-4">
              <img
                src={customer.photoUrl || '/placeholder.png'}
                alt={customer.fullName}
                className="w-32 h-32 rounded-full mx-auto"
              />
              <h2 className="text-xl font-bold mt-4 text-center">{customer.fullName}</h2>
              <p className="text-center text-gray-500">{customer.email}</p>
              <p className="text-center">{customer.nationality}</p>
              <p className="text-center text-sm text-gray-400">
                DOB: {format(new Date(customer.dob), 'dd/MM/yyyy')}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="btn-primary"
                  onClick={() => alert(`Edit feature for ${customer.fullName} not implemented yet.`)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
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
  
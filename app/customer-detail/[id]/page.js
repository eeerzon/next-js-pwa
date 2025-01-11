'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { format } from 'date-fns';
import Sidebar from '@/app/components/Sidebar';

const CustomerDetail = (params) => {
  const router = useRouter();
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching customer:', error);
    } else {
      setCustomer(data);
    }
    setLoading(false);
  };

  const handleEdit = () => router.push(`/customer-edit/${customer.id}`);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) {
      console.error('Error deleting customer:', error);
    } else {
      alert('Customer deleted successfully!');
      router.push('/dashboard');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!customer) {
    return <p>Customer not found.</p>;
  }

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
        <h1 className="text-2xl font-bold mb-4">Customer Details</h1>

        <div
          className={`p-4 rounded-md shadow-md ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}
        >
          <img
            src={customer.photo_url || '/default-profile.png'}
            alt={customer.full_name}
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-center mb-2">
            {customer.full_name}
          </h2>
          <p className="text-center mb-1">Email: {customer.email}</p>
          <p className="text-center mb-1">Phone: {customer.phone}</p>
          <p className="text-center mb-1">Address: {customer.address}</p>
          <p className="text-center mb-1">
            DOB: {customer.brith_date ? format(new Date(customer.brith_date), 'dd/MM/yyyy') : 'N/A'}
          </p>
          <p className="text-center mb-1">Nationality: {customer.nationality}</p>
          <p className="text-center mb-1">Country: {customer.country || 'N/A'}</p>

          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      </div>      
      </div>
    </div>
  );
};



export default CustomerDetail;
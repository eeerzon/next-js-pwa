'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { format } from 'date-fns';
import { useDarkMode } from 'usehooks-ts';
import Sidebar from '@/app/components/Sidebar';

const CustomerDetail = ({ paramsid }) => {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);
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

    // const id = window.customerId; // Ambil ID dari window
    // setCustomerId(id); // Set ID di state

    // console.log("ID : ", id);

    if (typeof window !== 'undefined') {


      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault(); // Mencegah dialog install default muncul
        setDeferredPrompt(e); // Menyimpan event prompt yang ditunda
      };

      // Menambahkan event listener hanya di client-side
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Cleanup event listener ketika komponen unmount
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
      
    }if (id) {
      setCustomerId(id); // Set customerId saat id sudah ada
    }

    if (id) {
      fetchCustomerDetails();
    }
  }, [paramsid]);

  // if (!customerId) {
  //   return <p>Loading...</p>;
  // } else {
  //   const { id } = router.query; // Mengambil parameter id dari URL
  //   console.log('ID : ', id)
  // }

  const fetchCustomerDetails = async () => {
    setLoading(true);

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single(); // Menambahkan ID filter sesuai dengan paramsid

      if (error) {
        setError(error);
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data); // Menyimpan data pelanggan yang diterima

        console.log('Data :', data);
      }
    setLoading(false);
  };

  const handleEdit = () => router.push(`/customer-edit/${id}`);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

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

  // if (!customers) {
  //   return <p>Customer not found.</p>;
  // }

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
              <div
                className={`card p-4 cursor-pointer shadow-md ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } hover:shadow-lg transition duration-200`}
              >
                <img
                  src={customers.photo_url}
                  alt={customers.full_name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-center mb-2">
                  {customers.full_name}
                </h2>
                <p className="text-center mb-1">Email: {customers.email}</p>
                <p className="text-center mb-1">Phone: {customers.phone}</p>
                <p className="text-center mb-1">Address: {customers.address}</p>
                <p className="text-center mb-1">
                  DOB: {customers.birth_date ? format(new Date(customers.birth_date), 'dd/MM/yyyy') : 'N/A'}
                </p>
                <p className="text-center mb-1">Nationality: {customers.nationality}</p>
                <p className="text-center mb-1">Country: {customers.country || 'N/A'}</p>

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
    </div>
  );


};



export default CustomerDetail;
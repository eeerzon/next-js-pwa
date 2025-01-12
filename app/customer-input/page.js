'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { getNames } from 'country-list';
import toast from 'react-hot-toast';
import { supabase } from '@/app/lib/supabase';
import { useDarkMode } from 'usehooks-ts';
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from '@/app/components/Sidebar';

const CustomerForm = () => {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();
  const countries = getNames();
  const [setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: new Date(),
    nationality: 'WNI',
    country: '',
    photo: null,
    photoPreview: null
  });

  
  // const [formData, setFormData] = useState({
  //   full_name: 'sadfdgh',
  //   email: 'safgh@gmail.com',
  //   phone: '43569',
  //   address: 'dfdggdf',
  //   birth_date: new Date(),
  //   nationality: 'WNI',
  //   country: '',
  //   photo: null,
  //   photoPreview: null
  // });

  // const [inputValue, setInputValue] = useState('');

  // const { name, value, type, files } = e.target;
  //   if (type === "file") {
  //     const file = files[0];
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: file,
  //       photoPreview: file ? URL.createObjectURL(file) : null
  //     }));
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.full_name) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!/^\d+$/.test(formData.phone)) return 'Phone number must contain only digits';
    if (!formData.address) return 'Address is required';
    if (formData.birth_date > new Date()) return 'Birth date cannot be in the future';
    if (formData.nationality === 'WNA' && !formData.country) return 'Country is required for WNA';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      console.log(error);
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      let photo_url = '';
      
      if (formData.photo) {
        const fileExt = formData.photo.name;
        // const fileExt = formData.photo.name.split('.').pop();
        // const fileName = `${Date.now()}.${fileExt}`;
        // const filePath = `customer-photos/${fileName}`;
        const filePath = `customer-photos/${fileExt}`;

        console.log('image Name:', formData.photo.name);

        console.log('file Path:', filePath);
        console.log('file :', formData.photo);

          const { error } = await supabase.storage
            .from('customer-photos')
            .upload(filePath, formData.photo);
      
          if (error) {
            throw error;
          }
      
        console.log('File uploaded successfully:');

        try {
          const { publicURL, error } = supabase.storage
            .from('customer-photos')  // Your bucket name
            .getPublicUrl(filePath);

        if (error) throw error;

        console.log('Public URL:', publicURL);

        photo_url = publicURL;
        } catch (error){
          console.error('Error getting public URL:', error.message);
        }

        if (photo_url = null){
          photo_url = 'null';
        }

        
      }

      const { error: insertError } = await supabase
        .from('customers')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            birth_date: formData.birth_date,
            nationality: formData.nationality,
            country: formData.nationality === 'WNA' ? formData.country : null,
            photo_url: photo_url,
          },
        ]);

        if (insertError) throw insertError;

      toast.success('Customer added successfully');
      router.push('/dashboard');

    } catch (error) {
      toast.error('Error adding customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
              Add New Customer
            </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              />
            </div>

            <div>
            <label className="block text-sm font-medium text-black dark:text-white">
                Email *
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Birth Date *
              </label>
              <DatePicker
                selected={formData.birthDate}
                onChange={date => setFormData(prev => ({ ...prev, birthDate: date }))}
                maxDate={new Date()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Nationality *
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
              >
                <option className="text-black dark:white" value="WNI">WNI</option>
                <option className="text-black dark:white" value="WNA">WNA</option>
              </select>
            </div>

            {formData.nationality === 'WNA' && (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white"
                  >
                  <option className="text-black dark:white" value="">Select Country</option>
                  {countries.map(country => (
                    <option className="text-black dark:white" key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full text-black dark:text-white"
              />
              {formData.photoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-black dark:text-white">{formData.photo.name}</p>
                  <img
                    src={formData.photoPreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSubmit}
              >
              Save Customer
            </button>
            
            </form>
            <div>
            
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
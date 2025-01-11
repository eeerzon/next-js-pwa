'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/compat/router';
import DatePicker from 'react-datepicker';
import { getNames } from 'country-list';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useDarkMode } from 'usehooks-ts';
import "react-datepicker/dist/react-datepicker.css";

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

const CustomerForm = () => {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();
  const countries = getNames();
  const [loading, setLoading] = useState(false);
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
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      let photo_url = '';
      
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `customer-photos/${fileName}`;

        const { error: uploadError} = await supabase.storage
          .from('customer-photos')
          .upload(filePath, formData.photo);

        if (uploadError) throw uploadError;

        const { publicURL, error: publicUrlError } = supabase.storage
          .from('customer-photos')
          .getPublicUrl(filePath);

        if (publicUrlError) throw publicUrlError;

        photo_url = publicURL;
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
          className={`flex-1 ml-${collapsed ? '16' : '64'} transition-all p-4`}
        >
          <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white">
              Add New Customer
            </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                  formData.fullName ? 'text-black' : 'text-gray-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                  formData.email ? 'text-black' : 'text-gray-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Birth Date *
              </label>
              <DatePicker
                selected={formData.birthDate}
                onChange={date => setFormData(prev => ({ ...prev, birthDate: date }))}
                maxDate={new Date()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Nationality *
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                  formData.nationality ? 'text-black' : 'text-gray-700'
                }`}
              >
                <option className="text-gray-800" value="WNI">WNI</option>
                <option className="text-gray-800" value="WNA">WNA</option>
              </select>
            </div>

            {formData.nationality === 'WNA' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-wwhite">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                    formData.country ? 'text-black' : 'text-gray-700'
                  }`}
                  >
                  <option className="text-gray-800" value="">Select Country</option>
                  {countries.map(country => (
                    <option className="text-gray-800" key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full"
              />
              {formData.photoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-black">{formData.photo.name}</p>
                  <img
                    src={formData.photoPreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
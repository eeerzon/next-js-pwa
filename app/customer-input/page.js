'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/compat/router';
import DatePicker from 'react-datepicker';
import { getNames } from 'country-list';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import "react-datepicker/dist/react-datepicker.css";

const CustomerForm = () => {
  const router = useRouter();
  const countries = getNames();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: new Date(),
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
    if (!formData.fullName) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!/^\d+$/.test(formData.phone)) return 'Phone number must contain only digits';
    if (!formData.address) return 'Address is required';
    if (formData.birthDate > new Date()) return 'Birth date cannot be in the future';
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
      let photoUrl = '';
      
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        // const { error: uploadError, data } = await supabase.storage
        //   .from('customer-photos')
        //   .upload(fileName, formData.photo);

        // if (uploadError) throw uploadError;
        // photoUrl = data.publicUrl;

        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file); // 'file' is usually used by Supabase

        const url = 'https://ihhwhajrvkhditkpgjqv.supabase.co/storage/v1/object/customer-photos/' + fileName + "'";
        const headers = {
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaHdoYWpydmtoZGl0a3BnanF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0Mjk4MTQsImV4cCI6MjA1MjAwNTgxNH0.QFxRdu2tTCWjus0RFgHEVAhl0-B8zClbZ_F5nsCgqg0'
        };
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData,
        })
        .then(response => {
        if (response.ok) {
            console.log('File uploaded successfully');
            
        } else {
            console.error('File upload failed:', response.status, response.statusText);
            response.text().then(text => console.error("Response body: ", text));
        }
        })
        .catch(error => {
        console.error('Network error:', error);
        });

      }

      const { error: insertError } = await supabase
        .from('customers')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            birth_date: formData.birthDate,
            nationality: formData.nationality,
            country: formData.nationality === 'WNA' ? formData.country : null,
            photo_url: photoUrl
          }
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-300 dark:text-white">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>
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
            <img
              src={formData.photoPreview}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded-md"
            />
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
  );
};

export default CustomerForm;

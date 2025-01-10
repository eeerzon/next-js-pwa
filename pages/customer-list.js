import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaTrashAlt, 
  FaPen, 
  FaChevronLeft, 
  FaChevronRight
} from 'react-icons/fa';

const CustomerCard = ({ customer, onDelete, onEdit }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {customer.full_name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {customer.email}
        </p>
      </div>
      {customer.photo_url && (
        <img
          src={customer.photo_url || "/api/placeholder/48/48"}
          alt={customer.full_name}
          className="h-12 w-12 rounded-full object-cover"
        />
      )}
    </div>
    
    <div className="mt-4 space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        📞 {customer.phone}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        🏠 {customer.address}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        🌍 {customer.nationality} {customer.country ? `- ${customer.country}` : ''}
      </p>
    </div>

    <div className="mt-4 flex justify-end space-x-2">
      <button
        onClick={() => onEdit(customer)}
        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        <FaPen className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(customer.id)}
        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400"
      >
        <FaTrashAlt className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const CustomerList = () => {
  // Sample data for demonstration
  const sampleData = [
    {
      id: 1,
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      nationality: "WNI",
      created_at: "2024-01-01"
    },
    {
      id: 2,
      full_name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: "456 Oak Ave",
      nationality: "WNA",
      country: "United States",
      created_at: "2024-01-02"
    }
  ];

  const [customers, setCustomers] = useState(sampleData);
  const [loading, setLoading] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(sampleData.length);
  const [filters, setFilters] = useState({
    nationality: '',
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = sampleData.filter(customer => 
      customer.full_name.toLowerCase().includes(term.toLowerCase()) ||
      customer.email.toLowerCase().includes(term.toLowerCase())
    );
    setCustomers(filtered);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    let filtered = [...sampleData];
    
    if (newFilters.nationality) {
      filtered = filtered.filter(c => c.nationality === newFilters.nationality);
    }
    if (newFilters.startDate) {
      filtered = filtered.filter(c => c.created_at >= newFilters.startDate);
    }
    if (newFilters.endDate) {
      filtered = filtered.filter(c => c.created_at <= newFilters.endDate);
    }
    
    setCustomers(filtered);
  };

  const handleSort = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const sorted = [...customers].sort((a, b) => {
      if (newOrder === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });
    
    setCustomers(sorted);
  };

  const handleDelete = (id) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    setTotalCustomers(prev => prev - 1);
  };

  const handleEdit = (customer) => {
    // In a real app, this would navigate to edit page
    console.log('Edit customer:', customer);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers ({totalCustomers})
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={filters.nationality}
            onChange={(e) => handleFilter({ ...filters, nationality: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Nationalities</option>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>

          <button
            onClick={() => handleSort('full_name')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaSort className="h-4 w-4" />
            Sort by Name
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
        <span className="p-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={customers.length < itemsPerPage}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomerList;

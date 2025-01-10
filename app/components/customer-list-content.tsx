'use client'

import { useEffect, useState } from 'react'
import type { Customer, CustomerListProps } from './types/customer'

export function CustomerListContent({
  page,
  setPage,
  itemsPerPage,
  searchTerm,
  handleSearch,
  filters,
  handleFilter,
  handleSort,
  error,
  setError
}: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setError(null)
        const response = await fetch(
          `/api/customers?page=${page}&limit=${itemsPerPage}&search=${searchTerm}&nationality=${filters.nationality}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data || !Array.isArray(data.customers)) {
          throw new Error('Invalid data format received from the server')
        }

        setCustomers(data.customers)
      } catch (error) {
        console.error('Error fetching customers:', error)
        setError('Failed to fetch customers. Please try again later.')
      }
    }

    fetchCustomers()
  }, [page, searchTerm, filters, itemsPerPage, setError])

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {customers.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Email</th>
              <th className="p-2 border border-gray-300">Nationality</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="p-2 border border-gray-300">{customer.full_name}</td>
                <td className="p-2 border border-gray-300">{customer.email}</td>
                <td className="p-2 border border-gray-300">{customer.nationality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 my-4">No customers found.</p>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
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
            ↕️ Sort by Name
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
        >
          ◀️
        </button>
        <span className="p-2">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={customers.length < itemsPerPage}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
        >
          ▶️
        </button>
      </div>
    </div>
  )
}


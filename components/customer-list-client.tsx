'use client'

import { useState } from 'react'
import { CustomerListContent } from './customer-list-content'
import type { Customer } from './types/customer'

export function CustomerListClient() {
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ nationality: '' })
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleFilter = (newFilters: { nationality: string }) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleSort = (field: keyof Customer) => {
    console.log(`Sorting by ${field}`)
  }

  return (
    <CustomerListContent
      page={page}
      setPage={setPage}
      itemsPerPage={itemsPerPage}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      filters={filters}
      handleFilter={handleFilter}
      handleSort={handleSort}
      error={error}
      setError={setError}
    />
  )
}


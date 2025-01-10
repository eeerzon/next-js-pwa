export interface Customer {
    id: number
    full_name: string
    email: string
    nationality: string
  }
  
  export interface CustomerListProps {
    page: number
    setPage: (page: number) => void
    itemsPerPage: number
    searchTerm: string
    handleSearch: (value: string) => void
    filters: { nationality: string }
    handleFilter: (filters: { nationality: string }) => void
    handleSort: (field: keyof Customer) => void
    error: string | null
    setError: (error: string | null) => void
  }
  
  
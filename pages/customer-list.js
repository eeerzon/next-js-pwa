import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import styles from '../styles/CustomerList.module.css'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [filter, setFilter] = useState({ nationality: 'all', date: '' })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('fullName')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [customers, filter, search, sort])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
      if (error) throw error
      setCustomers(data)
    } catch (error) {
      setError('Error fetching customers: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let result = [...customers]
    
    // Apply nationality filter
    if (filter.nationality !== 'all') {
      result = result.filter(customer => customer.nationality === filter.nationality)
    }
    
    // Apply date filter
    if (filter.date) {
      result = result.filter(customer => 
        new Date(customer.created_at).toDateString() === new Date(filter.date).toDateString()
      )
    }
    
    // Apply search
    if (search) {
      result = result.filter(customer => 
        customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply sort
    result.sort((a, b) => {
      if (a[sort] < b[sort]) return -1
      if (a[sort] > b[sort]) return 1
      return 0
    })
    
    setFilteredCustomers(result)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', id)
        if (error) throw error
        fetchCustomers()
      } catch (error) {
        setError('Error deleting customer: ' + error.message)
      }
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customer List</h1>
      <div className={styles.filters}>
        <select
          value={filter.nationality}
          onChange={(e) => setFilter({...filter, nationality: e.target.value})}
          className={styles.select}
        >
          <option value="all">All Nationalities</option>
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({...filter, date: e.target.value})}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={styles.select}
        >
          <option value="fullName">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="created_at">Sort by Date Added</option>
        </select>
      </div>
      <div className={styles.list}>
        {filteredCustomers.map(customer => (
          <div key={customer.id} className={styles.card}>
            <Link href={`/customer/${customer.id}`}>
              <h2>{customer.fullName}</h2>
              <p>{customer.email}</p>
              <p>{customer.nationality}</p>
              <p>{new Date(customer.created_at).toLocaleDateString()}</p>
            </Link>
            <div className={styles.actions}>
              <Link href={`/customer/edit/${customer.id}`}>
                <button className={styles.editButton}>Edit</button>
              </Link>
              <button 
                onClick={() => handleDelete(customer.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className={styles.total}>Total Customers: {filteredCustomers.length}</p>
    </div>
  )
}


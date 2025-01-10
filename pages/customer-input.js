import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import styles from '../styles/CustomerInput.module.css'

export default function CustomerInput() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
    nationality: 'WNI',
    country: '',
    photo: null
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        photo: file
      }))
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    if (!formData.fullName) return 'Full Name is required'
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) return 'Valid email is required'
    if (!formData.phoneNumber || !/^\d+$/.test(formData.phoneNumber)) return 'Valid phone number is required'
    if (!formData.address) return 'Address is required'
    if (!formData.birthDate) return 'Birth date is required'
    if (formData.nationality === 'WNA' && !formData.country) return 'Country is required for WNA'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      let photoUrl = null
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from('customer-photos')
          .upload(fileName, formData.photo)

        if (uploadError) throw uploadError
        photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/customer-photos/${fileName}`
      }

      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            ...formData,
            photo: photoUrl,
            birthDate: new Date(formData.birthDate).toISOString()
          }
        ])

      if (error) throw error
      router.push('/customer-list')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customer Input</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          pattern="[0-9]*"
          required
          className={styles.input}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          required
          className={styles.input}
        />
        <select
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
        {formData.nationality === 'WNA' && (
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className={styles.input}
          />
        )}
        <input
          type="file"
          name="photo"
          onChange={handlePhotoChange}
          accept="image/*"
          className={styles.input}
        />
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            className={styles.preview}
          />
        )}
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}


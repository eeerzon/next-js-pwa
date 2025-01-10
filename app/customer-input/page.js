import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { supabase } from '../../lib/supabase'; // Buat koneksi Supabase
import 'react-datepicker/dist/react-datepicker.css';

type CustomerFormInputs = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: Date;
  nationality: string;
  country?: string;
  photo: FileList;
};

export default function AddCustomer() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CustomerFormInputs>();
  const [preview, setPreview] = useState<string | null>(null);
  const nationality = watch('nationality');

  const onSubmit: SubmitHandler<CustomerFormInputs> = async (data) => {
    const { fullName, email, phone, address, dob, nationality, country, photo } = data;

    const file = photo[0];
    let photoUrl = '';
    if (file) {
      const { data: uploadData, error } = await supabase.storage
        .from('customer-photos')
        .upload(`photos/${file.name}`, file);
      if (error) return console.error(error.message);
      photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${uploadData.path}`;
    }

    const { error } = await supabase
      .from('customers')
      .insert({ fullName, email, phone, address, dob, nationality, country, photoUrl });
    if (error) console.error(error.message);
    else alert('Customer data saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Customer</h1>
      <div>
        <label>Full Name</label>
        <input {...register('fullName', { required: true })} className="input" />
        {errors.fullName && <span className="text-red-500">Full Name is required</span>}
      </div>
      <div>
        <label>Email</label>
        <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="input" />
        {errors.email && <span className="text-red-500">Invalid email address</span>}
      </div>
      <div>
        <label>Phone</label>
        <input {...register('phone', { required: true, pattern: /^[0-9]+$/ })} className="input" />
        {errors.phone && <span className="text-red-500">Phone must be numeric</span>}
      </div>
      <div>
        <label>Address</label>
        <textarea {...register('address', { required: true })} className="input" />
        {errors.address && <span className="text-red-500">Address is required</span>}
      </div>
      <div>
        <label>Date of Birth</label>
        <DatePicker
          selected={watch('dob')}
          onChange={(date: Date) => setValue('dob', date)}
          maxDate={new Date()}
          className="input"
        />
        {errors.dob && <span className="text-red-500">Invalid date</span>}
      </div>
      <div>
        <label>Nationality</label>
        <select {...register('nationality', { required: true })} className="input">
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
      </div>
      {/* {nationality === 'WNA' && (
        <div>
          <label>Country</label>
          <Select
            options={[{ value: 'USA', label: 'USA' }, { value: 'UK', label: 'UK' }]} // Tambahkan daftar negara
            onChange={(selected) => setValue('country', selected?.value || '')}
          />
        </div>
      )} */}
      <div>
        <label>Photo</label>
        <input
          type="file"
          {...register('photo')}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 mt-2" />}
      </div>
      <button type="submit" className="btn-primary">Submit</button>
    </form>
  );
}

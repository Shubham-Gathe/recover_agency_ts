import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/authSlice'; // Import your addUser action
import { AppDispatch } from '../store/store';

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AddUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      role: 'caller'
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(addUser(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input 
          type="text" 
          placeholder="Name" 
          {...register('name', { required: 'Name is required' })} 
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format.' } })} 
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      
      <div>
        <input 
          type="password" 
          placeholder="Password" 
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long.' } })} 
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      
      <div>
        <select {...register('role')}>
          <option value="admin">Admin</option>
          <option value="caller">Caller</option>
          <option value="executive">Executive</option>
        </select>
      </div>
      
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUser;

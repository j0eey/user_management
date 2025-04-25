import { useNavigate } from 'react-router-dom';
import { MinimalNavbar } from '../components/MinimalNavbar';
import { NewUserForm } from '../components/auth/NewUserForm';
import useCreateUser from '../hooks/useCreateUser';
import { toast } from 'react-hot-toast';
import { UserFormData } from '../lib/validation';
import { User } from '../types/user';

export default function NewUserPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateUser();

  const handleSubmit = async (data: UserFormData) => {
    try {
      await toast.promise(
  mutateAsync(data), 
  {
    loading: 'Creating user...',
    success: (user: User) => {
      navigate('/dashboard', {
        state: {
          newUserCreated: true,
          newUser: user
        }
      });
      return '';  // Return an empty string to show success toast message
    },
    error: (err: Error) => err.message || 'Error creating user'
  },
  { position: 'top-center' }
);

    } catch (error) {
      // Error handling
    }
  };

  return (
    <div>
      <MinimalNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <NewUserForm 
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
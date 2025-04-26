import { useNavigate } from 'react-router-dom';
import { MinimalNavbar } from '../components/MinimalNavbar';
import { NewUserForm } from '../components/auth/NewUserForm';
import useCreateUser from '../hooks/useCreateUser';
import { toast } from 'react-hot-toast';
import { UserFormData } from '../lib/validation';

export default function NewUserPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateUser();

  const handleSubmit = async (data: UserFormData) => {
    try {
      await toast.promise(
        mutateAsync(data), // This will trigger the createUser mutation
        {
          loading: 'Creating user...',
          success: () => {
            navigate('/dashboard'); // Redirect after successful user creation
            return 'User created successfully!';
          },
          error: (err: Error) => err.message || 'Error creating user',
        }
      );
    } catch (error) {
      // Error handling is done by toast.promise
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
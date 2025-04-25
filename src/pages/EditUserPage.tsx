import { useNavigate, useParams } from 'react-router-dom';
import { MinimalNavbar } from '../components/MinimalNavbar';
import { UserForm } from '../components/auth/UserForm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUser } from '../api/users';
import { UserFormData } from '../lib/validation';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { User } from '../types/user';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => {
      if (!id || !accessToken) throw new Error('Missing required data');
      return getUserById(id, accessToken);
    },
    enabled: !!id && !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: UserFormData) => {
      if (!id) throw new Error('No user ID provided');
      return updateUser(id, {
        ...values,
        status: values.status.toLowerCase() as 'active' | 'locked',
      }, accessToken);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', id], updatedUser);
      queryClient.setQueriesData({ queryKey: ['users'] }, (old: User[] | undefined) => 
        old?.map(u => u.id === id ? updatedUser : u)
      );
    }
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      await toast.promise(
        mutateAsync(data),
        {
          loading: 'Updating user...',
          success: 'User updated successfully!',
          error: (err: Error) => err.message || 'Error updating user'
        }
      );
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done by toast.promise
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading user data</p>
      </div>
    );
  }

  return (
    <div>
      <MinimalNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <UserForm 
        formTitle="Edit User"
        submitButtonText="Update User"
        onSubmit={handleSubmit}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName || '',
          email: user.email,
          status: user.status.toLowerCase() as 'active' | 'locked',
          dateOfBirth: user.dateOfBirth,
        }}
        isSubmitting={isPending}
      />
      </div>
    </div>


  );
}
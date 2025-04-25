import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { deleteUser } from '../api/users';
import { toast } from 'react-hot-toast';
import { User } from '../types/user';

export default function useDeleteUser() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) throw new Error('Missing access token');

      return toast.promise(
        deleteUser(id, accessToken),
        {
          loading: 'Deleting user...',
          success: 'User deleted successfully!',
          error: (err: Error) => err.message || 'Failed to delete user'
        },
        {
          duration: 2000,
          position: 'top-center'
        }
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousUsers = queryClient.getQueryData<User[]>(['users']) || [];

      queryClient.setQueryData(['users'],
        previousUsers.filter((user) => user.id !== id)
      );

      return { previousUsers };
    },
    onError: (_error, _id, context: { previousUsers?: User[] } | undefined) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

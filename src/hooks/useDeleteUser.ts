import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserById } from '../api/users';
import { toast } from 'react-hot-toast';
import { User } from '../types/user';

const USERS_QUERY_KEY = 'users';

const useDeleteUser = (debouncedSearchTerm: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      toast.promise(
        deleteUserById(userId),
        {
          loading: 'Deleting user...',
          success: 'User deleted successfully!',
          error: (err: Error) => err.message || 'Failed to delete user',
        },
        {
          duration: 600,
          position: 'top-center',
        }
      ),

    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY, debouncedSearchTerm] });

      const previousUsers = queryClient.getQueryData<User[]>([USERS_QUERY_KEY, debouncedSearchTerm]);

      queryClient.setQueryData<User[]>(
        [USERS_QUERY_KEY, debouncedSearchTerm],
        (old) => old?.filter((user) => user.id !== userId) ?? []
      );

      return { previousUsers };
    },

    onError: (_err, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData([USERS_QUERY_KEY, debouncedSearchTerm], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, debouncedSearchTerm] });
    },
  });
};

export default useDeleteUser;

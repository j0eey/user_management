import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { UserFormData } from "../lib/validation";
import { User } from "../types/user";
import { createUser } from "../api/users";

function generateTempId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'temp-' + crypto.randomUUID();
  }
  return 'temp-' + Math.random().toString(36).substring(2, 11);
}

export default function useCreateUser() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<User, Error, UserFormData, { previousUsers?: User[] }>({
    mutationFn: (data) => {
      if (!accessToken) throw new Error('No authentication token found');
      return createUser(data, accessToken); 
    },
    onMutate: async (newUserData) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']) || [];

      const optimisticUser: User = {
        ...newUserData,
        id: generateTempId(),
        status: newUserData.status.toUpperCase() as 'ACTIVE' | 'LOCKED',
        lastName: newUserData.lastName || undefined,
      };

      // Optimistic update
      queryClient.setQueryData(['users'], [...previousUsers, optimisticUser]);

      // Background refetch to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['users'],
        refetchType: 'inactive'
      });

      return { previousUsers };
    },
    onSuccess: (createdUser) => {
      queryClient.setQueryData(['users'], (old: User[] | undefined) => {
        const cleanList = old?.filter(u => !u.id.startsWith('temp-')) || [];
        return [...cleanList, { ...createdUser, __version: Date.now() }];
      });
      
      queryClient.setQueryDefaults(['users'], {
        staleTime: 1000 * 30 
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers); 
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
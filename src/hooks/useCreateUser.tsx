import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { UserFormData } from "../lib/validation";
import { User } from "../types/user";
import { createUser } from "../api/users";

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
        id: 'temp-' + crypto.randomUUID(),
        status: newUserData.status.toUpperCase() as 'ACTIVE' | 'LOCKED',
        lastName: newUserData.lastName || undefined
      };

      // 1. Immediate optimistic update
      queryClient.setQueryData(['users'], [...previousUsers, optimisticUser]);
      
      // 2. Start parallel background refresh (non-blocking)
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
    }
  });
}
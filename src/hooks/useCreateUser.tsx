import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { UserFormData } from "../lib/validation";
import { User } from "../types/user";
import { createUser } from "../api/users";

export default function useCreateUser() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => {
      if (!accessToken) throw new Error('Missing access token');
      return createUser(data, accessToken);  // Now returns User directly
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

      queryClient.setQueryData(['users'], [...previousUsers, optimisticUser]);

      return { previousUsers, optimisticUser };
    },
    onSuccess: (createdUser, _, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], (old: User[] | undefined) => 
          old?.map(user => 
            user.id === context.optimisticUser.id ? createdUser : user
          )
        );
      }
    },
    onError: (error, _, context: { previousUsers?: User[] } | undefined) => {
      console.error('Create User Error:', error);
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
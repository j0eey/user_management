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
      return createUser(data, accessToken);
    },
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']) || [];

      queryClient.setQueryData(['users'], [
        ...previousUsers,
        {
          ...newUser,
          id: crypto.randomUUID(),
          status: newUser.status.toUpperCase() as 'ACTIVE' | 'LOCKED'
        }
      ]);

      return { previousUsers };
    },
    onError: (error, _, context: { previousUsers?: User[] } | undefined) => {
      console.error('Mutation Error:', error);
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

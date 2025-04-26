import { useAuthStore } from '../store/authStore';
import { UserFormData } from "../lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../types/user";

interface UpdateUserVariables {
  id: string;
  data: UserFormData;
}

export default function useUpdateUser() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserVariables, { previousUsers?: User[] }>({
    mutationFn: async ({ id, data }) => {
      if (!accessToken) throw new Error('No authentication token found');

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Failed to update user');
      return result.result?.data?.user || result.data?.user;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']) || [];
      
      queryClient.setQueryData(['users'], previousUsers.map(user => 
        user.id === id ? { ...user, ...data } : user
      ));
      
      return { previousUsers };
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
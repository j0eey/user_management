import { useAuthStore } from '../store/authStore'; 
import { UserFormData } from "../components/auth/NewUserForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateUser() {
  const { accessToken } = useAuthStore(state => state);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserFormData) => {
      if (!accessToken) {
        throw new Error('No authentication token found. Please login again.');
      }

      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

      const payload = {
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        status: data.status,
        dateOfBirth: data.dateOfBirth,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || result?.result?.message || 'Failed to create user');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); 
    },
  });
}

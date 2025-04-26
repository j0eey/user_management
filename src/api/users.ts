import { User } from '../types/user';
import { UserFormData } from '../lib/validation';
import { useAuthStore } from '../store/authStore';

type ApiResponse<T> = {
  status: number;
  result?: {
    data: T;
    message: string;
  };
  data?: T;
  message?: string;
};



type UserStatus = 'ACTIVE' | 'LOCKED';

const normalizeResponse = <T>(response: ApiResponse<T>): { data: T; message: string } => ({
  data: response.result?.data || response.data || ({} as T),
  message: response.result?.message || response.message || 'Operation succeeded'
});

const normalizeUser = (user: User): User => ({
  ...user,
  status: user.status.toUpperCase() as UserStatus,
  lastName: user.lastName || undefined
});

const handleApiError = (error: unknown): never => {
  console.error('API Error:', error);
  throw error instanceof Error ? error : new Error('Network error occurred');
};

const getAuthHeaders = (accessToken: string | null) => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit,
  errorMessage: string
): Promise<T> => {
  try {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.result?.message || error.message || errorMessage);
    }

    const data = await response.json();
    return normalizeResponse<T>(data).data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUsers = async (
  searchTerm: string = '',
  accessToken: string | null
): Promise<User[]> => {
  const url = new URL('/api/users', window.location.origin);
  if (searchTerm.trim()) url.searchParams.append('search', searchTerm.trim());
  url.searchParams.append('page', '1');
  url.searchParams.append('itemsPerPage', '20');

  const data = await fetchApi<{ users: User[] }>(
    url.toString(),
    {
      method: 'GET',
      headers: getAuthHeaders(accessToken)
    },
    'Failed to fetch users'
  );

  return data.users.map(normalizeUser);
};

export const getUserById = async (
  id: string,
  accessToken: string | null
): Promise<User> => {
  const data = await fetchApi<{ user: User }>(
    `/api/users/${id}`,
    {
      method: 'GET',
      headers: getAuthHeaders(accessToken)
    },
    'Failed to fetch user'
  );

  return normalizeUser(data.user);
};

export const createUser = async (
  userData: UserFormData,
  accessToken: string | null
): Promise<User> => {  
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify({
      ...userData,
      status: userData.status.toUpperCase()
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create user');
  }

  const responseData = await response.json();
  const user = responseData.result?.data?.user || responseData.data?.user;
  
  if (!user) {
    throw new Error('Invalid user data received from server');
  }

  return user;
};

export const updateUser = async (
  id: string,
  userData: UserFormData,
  accessToken: string | null
): Promise<User> => {
  const data = await fetchApi<{ user: User }>(
    `/api/users/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        ...userData,
        status: userData.status.toUpperCase()
      })
    },
    'Failed to update user'
  );

  return normalizeUser(data.user);
};

export const deleteUserById = async (id: string): Promise<void> => {
  const { accessToken } = useAuthStore.getState();

  await fetchApi<void>(
    `/api/users/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(accessToken),
    },
    'Failed to delete user'
  );
};
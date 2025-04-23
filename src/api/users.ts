import { User } from '../types/user';

/**
 * Fetch users from the API with optional search support.
 * @param searchTerm - Optional search query (first name, last name, or email).
 * @param accessToken - Auth token for the request.
 * @returns List of users from the API.
 */
export const getUsers = async (
  searchTerm: string = '',
  accessToken: string | null
): Promise<User[]> => {
  const url = new URL('/api/users', window.location.origin);

  if (searchTerm.trim()) {
    url.searchParams.append('search', searchTerm.trim());
  }

  // Optional: Pagination (set manually or dynamically from UI)
  url.searchParams.append('page', '1');
  url.searchParams.append('itemsPerPage', '20');

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Support both possible response shapes
    return result.result?.data?.users || result.data?.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

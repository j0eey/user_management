import { User } from '../types/user';

/**
 * Fetch users from the API with optional search support.
 * @param searchTerm - Optional search query.
 * @param accessToken - Auth token for the request.
 * @returns List of users from the API.
 */
export const getUsers = async (
  searchTerm: string = '',
  accessToken: string | null
): Promise<User[]> => {
  // Use URLSearchParams to build the query string more effectively
  const params = new URLSearchParams();
  
  if (searchTerm) {
    const [firstName, lastName] = searchTerm.split(' ').map(term => term.trim());

    // We combine both firstName and lastName into a single search parameter
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
  }

  // Set up the URL and append search params
  const url = new URL('/api/users', window.location.origin);
  url.search = params.toString(); // Append parameters to the URL
  
  // Optional: Add pagination parameters (if the API supports it)
  const page = 1;  // Or determine this from the UI
  const itemsPerPage = 20;  // Set a reasonable number of items per page
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

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

    // Handle both possible response shapes (mock and real)
    return result.result?.data?.users || result.data?.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

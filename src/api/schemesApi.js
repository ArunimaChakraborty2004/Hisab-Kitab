const API_URL = 'http://localhost:5000/api/schemes';

export const getSchemes = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return await res.json();
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
};

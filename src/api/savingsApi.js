const API_URL = 'http://localhost:5000/api/savings-plans';

export const getSavingsPlans = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch savings plans');
    return await res.json();
  } catch (error) {
    console.error('Error fetching savings plans:', error);
    return [];
  }
};

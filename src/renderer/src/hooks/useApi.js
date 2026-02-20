import { useState } from 'react';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    try {
      setLoading(true);
      return await apiFunc(...args);
    } finally {
      setLoading(false);
    }
  };

  return { request, loading };
};

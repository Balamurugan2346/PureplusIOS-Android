import { useEffect, useState } from 'react';
import { getData } from '../OfflineStore/OfflineStore'; // adjust path

export function useUserId() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedId = await getData('userID');
        const parsed = Number(storedId);
        setUserId(isNaN(parsed) ? -1 : parsed);
      } catch (e) {
        setUserId(-1);
      } finally {
        setLoading(false);
      }
    };

    loadUserId();
  }, []);

  return { userId, loading };
}

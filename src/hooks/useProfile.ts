'use client';
import { useEffect, useState } from 'react';
import { http } from '@/libs/http';

export function useProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get('/api/auth/PROFILE');
        if (alive) setData(res.data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Error cargando perfil');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const refresh = async () => {
    const res = await http.get('/api/auth/PROFILE');
    setData(res.data);
    return res.data;
  };

  return { data, loading, error, refresh };
}

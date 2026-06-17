import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export function useLocationSharing(intervalMs = 30000) {
  const [isSharing, setIsSharing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const sendLocation = useCallback(async (lat: number, lng: number) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      await fetch(`${API_URL}/agents/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lat, lng }),
      });
      setLastSync(new Date());
      setError(null);
    } catch (e: any) {
      setError('Sync failed');
    }
  }, []);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setIsSharing(true);
    setError(null);

    const onPosition = (pos: GeolocationPosition) => {
      sendLocation(pos.coords.latitude, pos.coords.longitude);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, () => {}, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    });

    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(onPosition, () => {}, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    }, intervalMs);
  }, [sendLocation, intervalMs]);

  const stopSharing = useCallback(() => {
    setIsSharing(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  return { isSharing, lastSync, error, startSharing, stopSharing, sendLocation };
}

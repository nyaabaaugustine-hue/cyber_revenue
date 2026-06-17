import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export function useLocationTracking(enabled = true, intervalMs = 30000) {
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendLocation = useCallback(async (lat: number, lng: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      await fetch(`${API_URL}/agents/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lat, lng }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;

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

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs, sendLocation]);
}

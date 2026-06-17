import { useState, useEffect, useCallback, useRef } from 'react';

interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface UseGPSOptions {
  enableHighAccuracy?: boolean;
  watchPosition?: boolean;
  interval?: number;
}

export function useGPS(options: UseGPSOptions = {}) {
  const { enableHighAccuracy = true, watchPosition = false, interval = 30000 } = options;
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return false;
    }
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      setError('Location permission denied. Enable in browser settings.');
      return false;
    }
    return true;
  }, []);

  const getCurrentPosition = useCallback((): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        }),
        (err) => reject(new Error(err.message)),
        { enableHighAccuracy, timeout: 15000, maximumAge: 10000 }
      );
    });
  }, [enableHighAccuracy]);

  const startTracking = useCallback(async () => {
    const ok = await requestPermission();
    if (!ok) return;

    setIsTracking(true);
    setError(null);

    try {
      const pos = await getCurrentPosition();
      setPosition(pos);
    } catch (e: any) {
      setError(e.message);
    }

    if (watchPosition && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          });
          setError(null);
        },
        (err) => setError(err.message),
        { enableHighAccuracy, timeout: 15000, maximumAge: 5000 }
      );
    }

    intervalRef.current = setInterval(async () => {
      try {
        const pos = await getCurrentPosition();
        setPosition(pos);
      } catch {}
    }, interval);
  }, [requestPermission, getCurrentPosition, watchPosition, enableHighAccuracy, interval]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
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

  return { position, error, isTracking, startTracking, stopTracking, getCurrentPosition };
}

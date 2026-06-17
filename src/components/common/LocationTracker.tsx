import { useLocationTracking } from '../../hooks/useLocationTracking';
import { useAuth } from '../../utils/AuthContext';

export function LocationTracker() {
  const { user } = useAuth();
  const isAgent = user?.role === 'field_officer' || user?.role === 'supervisor';
  useLocationTracking(isAgent, 30000);
  return null;
}

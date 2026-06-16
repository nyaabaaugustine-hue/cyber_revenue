import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/Toast';

interface KeyboardShortcuts {
  enabled?: boolean;
  onNewCollection?: () => void;
  onSearch?: () => void;
  onToggleSidebar?: () => void;
  onRefresh?: () => void;
}

export const useKeyboardShortcuts = ({
  enabled = true,
  onNewCollection,
  onSearch,
  onToggleSidebar,
  onRefresh,
}: KeyboardShortcuts = {}) => {
  const navigate = useNavigate();
  const { success } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      // Command+K or Ctrl+K - Open command palette
      if (modifier && event.key === 'k') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-command-palette'));
      }

      // Command+Shift+S or Ctrl+Shift+S - Search
      if (modifier && event.shiftKey && event.key === 's') {
        event.preventDefault();
        onSearch?.();
      }

      // Command+D - New collection
      if (modifier && event.key === 'd') {
        event.preventDefault();
        onNewCollection?.();
      }

      // Command+Shift+D - New business
      if (modifier && event.shiftKey && event.key === 'd') {
        event.preventDefault();
        navigate('/businesses');
      }

      // Command+B - Toggle sidebar
      if (modifier && event.key === 'b') {
        event.preventDefault();
        onToggleSidebar?.();
      }

      // Command+R or Ctrl+R - Refresh
      if (modifier && event.key === 'r') {
        event.preventDefault();
        onRefresh?.();
        success('Data refreshed');
      }

      // Command+Shift+F - Focus search
      if (modifier && event.shiftKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }

      // Escape - Close modals, command palette
      if (event.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('escape-pressed'));
      }

      // Command+Shift+H - Go to dashboard
      if (modifier && event.shiftKey && event.key === 'h') {
        event.preventDefault();
        navigate('/');
      }

      // Command+Shift+M - Go to map
      if (modifier && event.shiftKey && event.key === 'm') {
        event.preventDefault();
        navigate('/map');
      }

      // Command+Shift+A - Go to agents
      if (modifier && event.shiftKey && event.key === 'a') {
        event.preventDefault();
        navigate('/agents');
      }

      // Command+Shift+C - Go to collections
      if (modifier && event.shiftKey && event.key === 'c') {
        event.preventDefault();
        navigate('/collections');
      }

      // Command+Shift+R - Go to reports
      if (modifier && event.shiftKey && event.key === 'r') {
        event.preventDefault();
        navigate('/reports');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onNewCollection,
    onSearch,
    onToggleSidebar,
    onRefresh,
    navigate,
  ]);
};
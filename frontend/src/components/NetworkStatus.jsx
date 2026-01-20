import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss('offline-toast');
      toast.success('✅ Back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('❌ No internet connection. Please connect to the internet.', {
        toastId: 'offline-toast',
        autoClose: false
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}

export default NetworkStatus;
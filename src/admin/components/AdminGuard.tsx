import { ReactNode, useEffect } from 'react';
import { getToken } from '@/admin/api';

interface AdminGuardProps {
  children: ReactNode;
  onUnauthorized: () => void;
}

export function AdminGuard({ children, onUnauthorized }: AdminGuardProps) {
  const token = getToken();

  useEffect(() => {
    if (!token) {
      onUnauthorized();
    }
  }, [token, onUnauthorized]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}

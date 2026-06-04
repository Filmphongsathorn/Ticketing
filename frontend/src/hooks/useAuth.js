import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth
 * Convenience hook to consume AuthContext anywhere in the tree.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

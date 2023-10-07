'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Define a TypeScript interface for your user object
export interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties here
}

// Define a TypeScript interface for your authentication context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  // Add any other context properties here
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Implement any initial authentication checks here if needed
    // This can be used to check if the user is already authenticated
    // and set the user state accordingly during app startup.
    // // Implement a function to check user authentication
    // // and set the user state accordingly
    // const checkAuthentication = async () => {
    //   // Fetch user authentication status from your backend
    //   // and update the user state
    //   // Example: const user = await fetchUserAuthentication();
    //   // setUser(user);
    // };
    // checkAuthentication();
  }, []);

  const redirectToLogin = useCallback(() => {
    // Only redirect to login if the user is not already there
    // if (pathName !== '/') {
    if (pathName === '/absence') {
      router.push('/');
    }
  }, [pathName, router]);

  useEffect(() => {
    // Automatically redirect to login screen if the user is not logged in
    if (!user) {
      redirectToLogin();
    }
  }, [redirectToLogin, user]);

  // Simulate a login function (replace with your actual login logic)
  const login = (userData: User) => {
    // Set the user to the provided user data
    setUser(userData);
  };

  // Simulate a logout function
  const logout = useCallback(() => {
    // Set the user to null to indicate logout
    setUser(null);
    redirectToLogin();
  }, [redirectToLogin]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, selectedRole?: string) => {
    // Mock authentication - in real app, call API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Determine role based on selectedRole or email
    let role = selectedRole || 'staff';
    let name = 'เจ้าหน้าที่';
    
    if (selectedRole) {
      if (selectedRole === 'approver') name = 'ผู้อนุมัติ';
      else if (selectedRole === 'executive') name = 'ผู้บริหาร';
      else if (selectedRole === 'scholar') name = 'นักเรียนทุน';
      else name = 'เจ้าหน้าที่';
    } else {
      if (email.includes('approver') || email.includes('อนุมัติ')) {
        role = 'approver';
        name = 'ผู้อนุมัติ';
      } else if (email.includes('executive') || email.includes('ผู้บริหาร')) {
        role = 'executive';
        name = 'ผู้บริหาร';
      } else if (email.includes('scholar') || email.includes('นักเรียนทุน')) {
        role = 'scholar';
        name = 'นักเรียนทุน';
      }
    }
    
    // Define beautiful avatar seeds per role
    const avatarSeeds: Record<string, string> = {
      staff: 'Felix',
      approver: 'Alexander',
      executive: 'Sophia',
      scholar: 'Aneka'
    };

    const seed = avatarSeeds[role] || name;
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      email: email || 'demo@example.com',
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=e2e8f0,f8fafc`,
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
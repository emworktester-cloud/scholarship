import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string; // 'staff', 'approver', 'executive', 'scholar', 'oea'
  region?: string; // e.g. 'USA', 'UK'
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, selectedRole?: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: string, region?: string) => void;
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
      else if (selectedRole === 'oea') name = 'เจ้าหน้าที่ สนร.';
      else name = 'เจ้าหน้าที่ส่วนกลาง';
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
      } else if (email.includes('oea') || email.includes('สนร')) {
        role = 'oea';
        name = 'เจ้าหน้าที่ สนร.';
      }
    }
    
    // Define beautiful avatar seeds per role
    const avatarSeeds: Record<string, string> = {
      staff: 'Felix',
      approver: 'Alexander',
      executive: 'Sophia',
      scholar: 'Aneka',
      oea: 'Destiny'
    };

    const seed = avatarSeeds[role] || name;
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      email: email || 'demo@example.com',
      name,
      role,
      region: role === 'oea' ? 'สหรัฐอเมริกา' : undefined,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=e2e8f0,f8fafc`,
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const setUserRole = (newRole: string, newRegion?: string) => {
    if (user) {
      let newName = user.name;
      if (newRole === 'approver') newName = 'ผู้อนุมัติ';
      else if (newRole === 'executive') newName = 'ผู้บริหาร';
      else if (newRole === 'scholar') newName = 'นักเรียนทุน';
      else if (newRole === 'oea') newName = 'เจ้าหน้าที่ สนร.';
      else newName = 'เจ้าหน้าที่ส่วนกลาง';

      const avatarSeeds: Record<string, string> = {
        staff: 'Felix',
        approver: 'Alexander',
        executive: 'Sophia',
        scholar: 'Aneka',
        oea: 'Destiny'
      };

      const updatedUser = { 
        ...user, 
        role: newRole, 
        name: newName, 
        region: newRegion || (newRole === 'oea' ? 'สหรัฐอเมริกา' : undefined),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeeds[newRole] || newName}&backgroundColor=e2e8f0,f8fafc`
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        setUserRole,
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
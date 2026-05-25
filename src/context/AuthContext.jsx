import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out

  const login = (email, password) => {
    // Simulate auth — accept any non-empty credentials
    if (!email.trim() || !password.trim()) return false;
    setUser({
      name: "Rahul Kumar",
      initials: "RK",
      email: email.trim(),
      role: "Owner",
      avatar: "from-indigo-500 to-violet-600",
      workspace: "DevFusion Team",
      plan: "Pro",
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("jwt")
  );

  const login = (newToken: string) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
    setupAutoLogout(newToken);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("review");

    setToken(null);
  }, []);

  const setupAutoLogout = useCallback(
    (jwtToken: string) => {
      const decoded = jwtDecode<{ exp: number }>(jwtToken);
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();

      if (now >= expiryTime) {
        logout();
      } else {
        setTimeout(() => {
          logout();
        }, expiryTime - now);
      }
    },
    [logout]
  );

  useEffect(() => {
    if (token) setupAutoLogout(token);
  }, [setupAutoLogout, token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

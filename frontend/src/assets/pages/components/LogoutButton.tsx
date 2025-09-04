import { useAuth } from "../../context/AuthContext.tsx";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <>
      <button onClick={logout} className="text-red-600 hover:underline">
        Logout
      </button>
    </>
  );
};

export default LogoutButton;

import { useAuth } from '../contexts/AuthContext';

const DevLogin = () => {
  const { loginAsAdmin } = useAuth();

  return (
    <button onClick={loginAsAdmin}>
      (DEV)
    </button>
  );
};

export default DevLogin;

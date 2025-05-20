import { useNavigate } from 'react-router-dom';
import api from '../api';
import { clearUser, getUser } from '../utils';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get('/logout');
    clearUser();
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome, User {getUser()}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

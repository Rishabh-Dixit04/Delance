import React, { useState, useEffect } from 'react';
import { connectWallet, getAccounts } from '../../services/web3';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    const { accounts } = await connectWallet();
    if (accounts) {
      setAccounts(accounts);
      setSelectedAccount(accounts[0]);
    }
  };

  const handleLogin = () => {
    if (!selectedAccount || !role) {
      alert('Please select an account and role to continue');
      return;
    }

    // Check for conflicting roles
    const storedRole = localStorage.getItem(selectedAccount);
    if (storedRole && storedRole !== role) {
      setErrorMessage(`This account is already registered as a ${storedRole}.`);
      return;
    }

    // Save account and role if there's no conflict
    localStorage.setItem(selectedAccount, role);
    localStorage.setItem('selectedAccount', selectedAccount);
    localStorage.setItem('role', role);

    if (role === 'client') {
      navigate('/client');
    } else if (role === 'freelancer') {
      navigate('/freelancer');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login with MetaMask</h2>
        
        {errorMessage && (
          <div className="auth-error">
            {errorMessage}
          </div>
        )}

        <div className="auth-field">
          <label>Choose Account:</label>
          <select
            className="auth-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>

        <div className="auth-field">
          <label>Role:</label>
          <select
            className="auth-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <button className="auth-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Auth;

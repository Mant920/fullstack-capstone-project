import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    // useState hooks for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Task 4: State for incorrect password error
    const [incorrectPassword, setIncorrectPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Task 5: Local variables from context and router
    const navigate = useNavigate();
    const { bearerToken, setIsLoggedIn, setUserName } = useAppContext();

    // Task 6: If already logged in, redirect to MainPage
    if (bearerToken) {
        navigate('/app');
    }

    const handleLogin = async () => {
        setIncorrectPassword('');
        setLoading(true);
        try {
            // Step 1: API call
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                // Task 7: Set method
                method: 'POST',
                // Task 8: Set headers
                headers: { 'Content-Type': 'application/json' },
                // Task 9: Set body to send user details
                body: JSON.stringify({ email, password })
            });

            // Step 2: Access data and set user details
            // Task 1: Access data in JSON format
            const data = await response.json();

            if (data.authtoken) {
                // Task 2: Set user details in session storage
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('name', data.userName);
                sessionStorage.setItem('email', data.userEmail);
                // Task 3: Set logged-in state via AppContext
                setIsLoggedIn(true);
                setUserName(data.userName);
                // Task 4: Navigate to MainPage after login
                navigate('/app');
            } else {
                // Task 5: Clear input and set error message
                setPassword('');
                setIncorrectPassword(data.error || 'Invalid email or password. Please try again.');
            }
        } catch (e) {
            setIncorrectPassword('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <div className="text-center mb-4">
                            <span className="login-icon">🎁</span>
                            <h2 className="mt-2 font-weight-bold">Welcome Back</h2>
                            <p className="text-muted small">Sign in to GiftLink</p>
                        </div>

                        {/* Task 6: Display error message */}
                        {incorrectPassword && (
                            <div className="alert alert-danger py-2 small">{incorrectPassword}</div>
                        )}

                        {/* Input elements for email and password */}
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        {/* Login button */}
                        <button
                            className="btn btn-primary w-100 login-btn"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                            ) : null}
                            {loading ? 'Signing in...' : 'Login'}
                        </button>

                        <p className="mt-4 text-center small">
                            New here?{' '}
                            <a href="/app/register" className="text-primary fw-semibold">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

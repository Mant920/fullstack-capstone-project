import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    // Task 4: useState hooks for all fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    // Task 5: handleRegister function
    const handleRegister = async () => {
        setError('');
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            });
            const data = await response.json();
            if (data.authtoken) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('name', data.userName);
                sessionStorage.setItem('email', data.userEmail);
                setIsLoggedIn(true);
                setUserName(data.userName);
                navigate('/app');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (e) {
            setError('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <div className="text-center mb-4">
                            <span className="register-icon">🎁</span>
                            <h2 className="mt-2 font-weight-bold">Create Account</h2>
                            <p className="text-muted small">Join the GiftLink community</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 small">{error}</div>
                        )}

                        {/* Task 6: Input elements for all fields */}
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                            />
                        </div>

                        {/* Task 7: Register button */}
                        <button
                            className="btn btn-primary w-100 register-btn"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                            ) : null}
                            {loading ? 'Creating account...' : 'Register'}
                        </button>

                        <p className="mt-4 text-center small">
                            Already a member?{' '}
                            <a href="/app/login" className="text-primary fw-semibold">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

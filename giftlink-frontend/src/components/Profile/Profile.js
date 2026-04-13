import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const { setUserName: setContextUserName } = useAppContext();

    const [userDetails, setUserDetails] = useState({
        name: sessionStorage.getItem('name') || '',
        email: sessionStorage.getItem('email') || ''
    });
    const [name, setName] = useState(userDetails.name);
    const [editMode, setEditMode] = useState(false);
    const [changed, setChanged] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        const authtoken = sessionStorage.getItem('auth-token');
        if (!authtoken) {
            navigate('/app/login');
        }
    }, [navigate]);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
                // Task 1: Set method
                method: 'PUT',
                // Task 2: Set headers
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                    'email': sessionStorage.getItem('email')
                },
                // Task 3: Set body to send user details
                body: JSON.stringify({ name })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authtoken) {
                    sessionStorage.setItem('auth-token', data.authtoken);
                }

                // Task 4: Set the new name in the AppContext
                setContextUserName(name);

                // Task 5: Set user name in the session
                sessionStorage.setItem('name', name);

                const updatedDetails = { ...userDetails, name };
                setUserDetails(updatedDetails);
                setEditMode(false);
                setChanged('Name updated successfully! ✅');
                setTimeout(() => {
                    setChanged('');
                    navigate('/app');
                }, 1500);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (e) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {userDetails.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <h3 className="profile-display-name">{userDetails.name}</h3>
                                <p className="profile-email">{userDetails.email}</p>
                            </div>

                            <div className="profile-body">
                                {changed && (
                                    <div className="alert alert-success py-2 small text-center">{changed}</div>
                                )}
                                {error && (
                                    <div className="alert alert-danger py-2 small text-center">{error}</div>
                                )}

                                {editMode ? (
                                    <div className="edit-form">
                                        <div className="mb-3">
                                            <label className="form-label profile-label">Display Name</label>
                                            <input
                                                type="text"
                                                className="form-control profile-input"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label profile-label">Email (read-only)</label>
                                            <input
                                                type="email"
                                                className="form-control profile-input"
                                                value={userDetails.email}
                                                disabled
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn profile-save-btn flex-fill"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" />
                                                ) : null}
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                className="btn profile-cancel-btn"
                                                onClick={() => { setEditMode(false); setName(userDetails.name); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-info">
                                        <div className="info-row">
                                            <span className="info-label">Full Name</span>
                                            <span className="info-value">{userDetails.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Email</span>
                                            <span className="info-value">{userDetails.email}</span>
                                        </div>
                                        <button
                                            className="btn profile-edit-btn w-100 mt-3"
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️ Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

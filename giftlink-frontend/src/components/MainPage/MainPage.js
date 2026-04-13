import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './MainPage.css';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Task 1: Fetch all gifts on mount
    useEffect(() => {
        fetch(`${urlConfig.backendUrl}/api/gifts`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch gifts');
                return res.json();
            })
            .then(data => {
                setGifts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Task 2: Navigate to the details page
    const handleGiftClick = (id) => {
        navigate(`/app/gift/${id}`);
    };

    // Task 3: Format the timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="main-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading gifts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}. Make sure the backend server is running.
                </div>
            </div>
        );
    }

    return (
        <div className="main-page">
            <div className="main-hero">
                <div className="container">
                    <h1 className="main-title">Community Gifts</h1>
                    <p className="main-subtitle">
                        Browse free items from your neighbors — give things a second life
                    </p>
                </div>
            </div>

            <div className="container main-content">
                {gifts.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">No gifts available right now. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        <p className="gift-count text-muted mb-4">{gifts.length} items available</p>
                        <div className="row g-4">
                            {gifts.map(gift => (
                                <div key={gift._id || gift.id} className="col-sm-6 col-md-4 col-lg-3">
                                    <div
                                        className="gift-card"
                                        onClick={() => handleGiftClick(gift.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={e => e.key === 'Enter' && handleGiftClick(gift.id)}
                                    >
                                        {/* Task 4: Display gift image or placeholder */}
                                        <div className="gift-card-image">
                                            {gift.image ? (
                                                <img
                                                    src={gift.image}
                                                    alt={gift.name}
                                                    className="gift-img"
                                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div
                                                className="gift-img-placeholder"
                                                style={{ display: gift.image ? 'none' : 'flex' }}
                                            >
                                                🎁
                                            </div>
                                        </div>

                                        <div className="gift-card-body">
                                            {/* Task 5: Display gift name */}
                                            <h5 className="gift-name">{gift.name}</h5>

                                            <div className="gift-meta">
                                                <span className={`gift-condition condition-${gift.condition?.toLowerCase().replace(' ', '-')}`}>
                                                    {gift.condition}
                                                </span>
                                                <span className="gift-category">{gift.category}</span>
                                            </div>

                                            <p className="gift-description">{gift.description}</p>

                                            {/* Task 6: Display the formatted date */}
                                            <p className="gift-date">📅 {formatDate(gift.date_added)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MainPage;

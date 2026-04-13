import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const [gift, setGift] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    // Task 1: Check for authentication and redirect if necessary
    useEffect(() => {
        const authtoken = sessionStorage.getItem('auth-token');
        if (!authtoken) {
            navigate('/app/login');
        }
    }, [navigate]);

    // Task 3: Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Task 2: Fetch gift details using the gift ID from the URL
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${urlConfig.backendUrl}/api/gifts/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Gift not found');
                return res.json();
            })
            .then(data => {
                setGift(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

        // Task 6: Fetch comments for this gift
        fetch(`${urlConfig.backendUrl}/api/comments/${id}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(() => setComments([]));
    }, [id]);

    // Task 4: Handle user click to navigate back
    const handleBack = () => navigate(-1);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatCommentDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            // Call sentiment service first (if available), then post comment
            let sentimentScore = 0;
            let sentimentLabel = 'neutral';
            try {
                const sentimentRes = await fetch('http://localhost:3001/sentiment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sentence: newComment })
                });
                if (sentimentRes.ok) {
                    const sentimentData = await sentimentRes.json();
                    sentimentScore = sentimentData.score;
                    sentimentLabel = sentimentData.sentiment;
                }
            } catch (_) { /* sentiment service might not be running */ }

            const response = await fetch(`${urlConfig.backendUrl}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({
                    giftId: id,
                    comment: newComment,
                    userName: sessionStorage.getItem('name') || 'Anonymous',
                    sentimentScore,
                    sentimentLabel
                })
            });
            const saved = await response.json();
            setComments(prev => [saved, ...prev]);
            setNewComment('');
        } catch (e) {
            console.error('Failed to post comment:', e);
        } finally {
            setCommentLoading(false);
        }
    };

    const sentimentEmoji = (label) => {
        if (label === 'positive') return '😊';
        if (label === 'negative') return '😞';
        return '😐';
    };

    // Task 7: Error handling
    if (loading) {
        return (
            <div className="details-loading">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 text-muted">Loading gift details...</p>
            </div>
        );
    }

    if (error || !gift) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error || 'Gift not found.'}</div>
                <button className="btn btn-secondary" onClick={handleBack}>← Go Back</button>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="container py-4">
                <button className="btn btn-outline-secondary mb-4 back-btn" onClick={handleBack}>
                    ← Back to Gifts
                </button>

                <div className="row g-4">
                    {/* Left: image */}
                    <div className="col-md-5">
                        {/* Task 5: Display the gift image */}
                        <div className="image-placeholder-large">
                            {gift.image ? (
                                <img
                                    src={gift.image}
                                    alt={gift.name}
                                    className="product-image-large"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="no-image-available-large">
                                    <span>🎁</span>
                                    <p>No image available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: details */}
                    <div className="col-md-7">
                        <div className="card details-card h-100">
                            <div className="card-header details-header">
                                <h2 className="details-title">{gift.name}</h2>
                            </div>
                            <div className="card-body">
                                <div className="d-flex gap-2 mb-3 flex-wrap">
                                    <span className={`badge condition-badge condition-${gift.condition?.toLowerCase().replace(' ', '-')}`}>
                                        {gift.condition}
                                    </span>
                                    <span className="badge category-badge">{gift.category}</span>
                                </div>

                                <p className="details-description">{gift.description}</p>

                                <div className="details-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">📅 Date Posted</span>
                                        <span className="meta-value">{formatDate(gift.date_added)}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">📍 ZIP Code</span>
                                        <span className="meta-value">{gift.zipcode}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">🕐 Age</span>
                                        <span className="meta-value">{gift.age_years} years ({gift.age_days} days)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task 6: Comments section */}
                <div className="comments-section mt-5">
                    <h4 className="comments-title">💬 Comments ({comments.length})</h4>

                    <div className="add-comment-box mb-4">
                        <textarea
                            className="form-control comment-input"
                            rows={3}
                            placeholder="Share your thoughts about this gift..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button
                            className="btn btn-primary mt-2 comment-submit-btn"
                            onClick={handleAddComment}
                            disabled={commentLoading || !newComment.trim()}
                        >
                            {commentLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>

                    {comments.length === 0 ? (
                        <p className="text-muted">No comments yet. Be the first to comment!</p>
                    ) : (
                        <div className="comments-list">
                            {comments.map((c, i) => (
                                <div key={c._id || i} className="comment-card">
                                    <div className="comment-header">
                                        <div className="comment-avatar">
                                            {c.userName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <strong className="comment-author">{c.userName}</strong>
                                            <span className="comment-date ms-2">{formatCommentDate(c.createdAt)}</span>
                                        </div>
                                        <span className="comment-sentiment ms-auto" title={c.sentimentLabel}>
                                            {sentimentEmoji(c.sentimentLabel)}
                                        </span>
                                    </div>
                                    <p className="comment-text">{c.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;

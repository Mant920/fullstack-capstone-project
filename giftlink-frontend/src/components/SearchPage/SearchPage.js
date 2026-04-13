import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

const CATEGORIES = ['', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Sports', 'Music', 'Electronics'];
const CONDITIONS = ['', 'New', 'Good', 'Older'];

function SearchPage() {
    // Task 1: State variables for search criteria and results
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Task 2: Fetch search results from the API based on user inputs
    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('name', searchQuery.trim());
            if (category) params.append('category', category);
            if (condition) params.append('condition', condition);
            params.append('age_years', ageRange);

            const response = await fetch(`${urlConfig.backendUrl}/api/search?${params.toString()}`);
            const data = await response.json();
            setResults(data);
        } catch (e) {
            console.error('Search failed:', e);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // Task 6: Navigate to the details page when a result is clicked
    const handleResultClick = (id) => {
        navigate(`/app/gift/${id}`);
    };

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="container">
                    <h1 className="search-page-title">Find Gifts</h1>
                    <p className="search-page-subtitle">Filter by name, category, condition, and age</p>
                </div>
            </div>

            <div className="container search-content">
                <div className="search-filters-card">
                    <div className="row g-3 align-items-end">
                        {/* Task 7: Text input for search criteria */}
                        <div className="col-md-4">
                            <label className="filter-label">Item Name</label>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Task 3: Category dropdown */}
                        <div className="col-md-2">
                            <label className="filter-label">Category</label>
                            <select
                                className="form-select search-select"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c || 'All Categories'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Task 3: Condition dropdown */}
                        <div className="col-md-2">
                            <label className="filter-label">Condition</label>
                            <select
                                className="form-select search-select"
                                value={condition}
                                onChange={e => setCondition(e.target.value)}
                            >
                                {CONDITIONS.map(c => (
                                    <option key={c} value={c}>{c || 'All Conditions'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Task 4: Age range slider */}
                        <div className="col-md-3">
                            <label className="filter-label">
                                Max Age: <strong>{ageRange} {ageRange === 1 ? 'year' : 'years'}</strong>
                            </label>
                            <input
                                type="range"
                                className="form-range age-slider"
                                min="1"
                                max="10"
                                step="1"
                                value={ageRange}
                                onChange={e => setAgeRange(parseInt(e.target.value))}
                            />
                            <div className="slider-labels">
                                <span>1 yr</span>
                                <span>10 yrs</span>
                            </div>
                        </div>

                        {/* Task 8: Search button */}
                        <div className="col-md-1">
                            <button
                                className="btn search-btn w-100"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" />
                                ) : '🔍'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task 5: Display search results */}
                {searched && (
                    <div className="search-results">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                                <p className="mt-3 text-muted">Searching...</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="alert no-results-alert" role="alert">
                                😕 No products found matching your criteria. Try adjusting your filters.
                            </div>
                        ) : (
                            <>
                                <p className="results-count">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
                                <div className="row g-3">
                                    {results.map(gift => (
                                        <div key={gift._id || gift.id} className="col-sm-6 col-md-4 col-lg-3">
                                            <div
                                                className="result-card"
                                                onClick={() => handleResultClick(gift.id)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={e => e.key === 'Enter' && handleResultClick(gift.id)}
                                            >
                                                {/* Task 8: Images in search results */}
                                                <div className="result-card-img">
                                                    {gift.image ? (
                                                        <img src={gift.image} alt={gift.name} className="result-img" />
                                                    ) : (
                                                        <div className="result-img-placeholder">🎁</div>
                                                    )}
                                                </div>
                                                <div className="result-card-body">
                                                    <h6 className="result-name">{gift.name}</h6>
                                                    <div className="d-flex gap-1 mb-2 flex-wrap">
                                                        <span className={`result-badge condition-${gift.condition?.toLowerCase().replace(' ', '-')}`}>
                                                            {gift.condition}
                                                        </span>
                                                        <span className="result-badge result-category">{gift.category}</span>
                                                    </div>
                                                    <p className="result-desc">{gift.description}</p>
                                                    <p className="result-date">📅 {formatDate(gift.date_added)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!searched && (
                    <div className="search-prompt">
                        <div className="search-prompt-icon">🔍</div>
                        <p>Use the filters above and click search to find gifts in your community.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;

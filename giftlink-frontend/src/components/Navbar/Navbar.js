import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark gl-navbar">
            <div className="container">
                <Link className="navbar-brand gl-brand" to="/">
                    <span className="gl-brand-icon">🎁</span>
                    GiftLink
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/public/home.html">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app">Gifts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/search">Search</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto align-items-center">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link gl-username" to="/app/profile">
                                        👤 {userName}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn gl-logout-btn ms-2" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn gl-register-btn ms-2" to="/app/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

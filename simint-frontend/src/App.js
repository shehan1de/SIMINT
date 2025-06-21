import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import History from './components/History';
import Home from './components/Home';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="SIMINT Logo" height="60" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#simintNavbar"
          aria-controls="simintNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="simintNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link nav-hover ${location.pathname === '/' ? 'active-page' : ''}`}
                to="/"
              >
                Query
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-hover ${location.pathname === '/history' ? 'active-page' : ''}`}
                to="/history"
              >
                History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="text-center text-muted py-3 border-top mt-auto">
      © {new Date().getFullYear()} SIMINT Project. All rights reserved.
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <div className="main-content container" style={{ marginTop: '100px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

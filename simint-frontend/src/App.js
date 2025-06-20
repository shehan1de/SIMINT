import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import History from './components/History';
import Home from './components/Home';

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">SIMINT</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Query</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

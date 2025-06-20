import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import '../App.css';

export default function App() {
  const [inputPhrase, setInputPhrase] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!inputPhrase.trim()) {
    setError('Please enter a valid question.');
    return;
  }
  setLoading(true);
  setError('');
  setResults([]);

  try {
    const response = await axios.post('/api/query', { phrase: inputPhrase });
    setResults(response.data.results);
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">SIMULATIVE INTELLIGENCE </h1>
        <p className="lead text-muted">Ask your questions and get graph-based answers instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label htmlFor="phraseInput" className="form-label fw-semibold">Enter your question</label>
          <textarea
            id="phraseInput"
            className="form-control shadow-sm border-primary"
            placeholder="e.g. Who committed the most recent crime?"
            rows={4}
            value={inputPhrase}
            onChange={(e) => setInputPhrase(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get Answer'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger text-center">⚠️ {error}</div>}

      {results.length > 0 && (
        <div>
          <h5 className="mb-3">Results</h5>
          {results.map((res, index) => (
            <div key={index} className="card shadow-sm mb-4 border-0">
              <div className="card-body">
                {Object.entries(res).map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <h6 className="text-secondary">{key}</h6>
                    <ul className="list-group list-group-flush ms-2">
                      {value.properties
                        ? Object.entries(value.properties).map(([propKey, propVal]) => (
                            <li key={propKey} className="list-group-item px-0 border-0">
                              <strong>{propKey}</strong>: {typeof propVal === 'object' && propVal.low !== undefined ? propVal.low : propVal}
                            </li>
                          ))
                        : <li className="list-group-item px-0 border-0">{JSON.stringify(value)}</li>
                      }
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

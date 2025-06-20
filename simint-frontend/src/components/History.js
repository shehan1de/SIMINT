import axios from 'axios';
import { useEffect, useState } from 'react';
import '../App.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get('http://localhost:5000/api/history');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <>
      <h2 className="fw-bold text-primary mb-4">Search History</h2>

      {loading && <p>Loading history...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {history.length === 0 && !loading ? (
        <p>No history found.</p>
      ) : (
        history.map((entry, index) => (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Query {index + 1}</h5>
              <p><strong>User Input - </strong> {entry.userInput}</p>
              

              <div>
                <strong>Results</strong>
                <ul className="list-group list-group-flush ms-3">
                  {Array.isArray(entry.results) && entry.results.length > 0 ? (
                    entry.results.map((res, idx) => (
                      <li key={idx} className="list-group-item px-0 border-0">
                        {Object.entries(res).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}</strong> - {typeof value === 'object' ? JSON.stringify(value) : value}
                          </div>
                        ))}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item px-0 border-0">No result</li>
                  )}
                </ul>
              </div>

              <p className="text-muted mt-3">
                <small>Timestamp: {new Date(entry.timestamp).toLocaleString()}</small>
              </p>
            </div>
          </div>
        ))
      )}
    </>
  );
}

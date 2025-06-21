import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import '../App.css';

export default function App() {
  const [inputPhrase, setInputPhrase] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef();

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

  const downloadPDF = () => {
  const input = resultRef.current;

  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    const logo = new Image();
    logo.src = '/1.png';

    logo.onload = () => {
      const logoWidth = 40;
      const logoHeight = (logo.height * logoWidth) / logo.width;

      pdf.addImage(logo, 'PNG', margin, y, logoWidth, logoHeight);

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Intelligence Report', pageWidth / 2, y + 10, { align: 'center' });

      const now = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${now}`, pageWidth / 2, y + 18, { align: 'center' });

      y += logoHeight + 20;

      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      const splitQuery = pdf.splitTextToSize(`Question :  ${inputPhrase}`, pageWidth - margin * 2);
      pdf.text(splitQuery, margin, y);
      y += splitQuery.length * 7 + 5;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);

      pdf.save('SIMINT-Result.pdf');
    };
  });
};



  return (
    <div className=''>
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">SIMULATIVE INTELLIGENCE</h1>
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
        <>
          <div className="text-end mb-3">
            <button className="btn btn-outline-dark" onClick={downloadPDF}>
              📄 Download PDF
            </button>
          </div>

          <div ref={resultRef}>
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
        </>
      )}
    </div>
    </div>
  );
}

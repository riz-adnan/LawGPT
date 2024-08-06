import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import UploadPage from './components/UploadPage';
import PDFParserReact from './components/PDFParser';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/pdfparser" element={<PDFParserReact />} />
      </Routes>
    </Router>
  );
}

export default App;

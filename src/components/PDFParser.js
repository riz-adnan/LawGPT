import React, { useState, useEffect } from 'react';
import pdfToText from 'react-pdftotext';
import { Container, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PDFParser.css'; // Create a CSS file for custom styles

const PDFParserReact = () => {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [pdfChats, setPdfChats] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    // Load previously saved questions from local storage
    const savedChats = JSON.parse(localStorage.getItem('pdfchat')) || [];
    setPdfChats(savedChats);
  }, [pdfChats, showPopup]);

  const extractText = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Delete previous questions from local storage
      localStorage.removeItem('pdfchat');

      // Extract text from PDF
      pdfToText(file)
        .then(text => {
          const sentences = text.split(/(?<=[.!?])\s+/); // Split text into sentences
          localStorage.setItem('pdftext', JSON.stringify(sentences));
          setText(sentences.join('\n')); // Join sentences for display (optional)
        })
        .catch(error => console.error("Failed to extract text from pdf", error));
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (question.trim()) {
        setShowPopup(true);
        const response = await fetch('http://localhost:5000/pdfchat', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ question: question, context: pdfChats })
            });
            setShowPopup(false);
            const data = await response.json();
            const answer = data.response;
            const userques= "You : "+question;
            const botans= "Ai-lawyer : "+answer;
      const updatedChats = [...pdfChats, userques,botans];
      localStorage.setItem('pdfchat', JSON.stringify(updatedChats));
      setPdfChats(updatedChats);
      setQuestion('');
    }
  };

  return (
    <Container fluid className="pdf-parser-react" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <header className="pdf-parser-header">
        <input type="file" accept="application/pdf" onChange={extractText} className="file-input" />
        
        
        <div className="chat-display">
          <h4>PDF Chats:</h4>
          <ListGroup>
            {pdfChats.length === 0 ? (
              <ListGroup.Item>No questions yet</ListGroup.Item>
            ) : (
              pdfChats.map((chat, index) => (
                <ListGroup.Item key={index}>{chat}</ListGroup.Item>
              ))
            )}
          </ListGroup>
          
          
          <Form onSubmit={handleSubmitQuestion} className='questions'>
          <Form.Group controlId="formQuestion">
            <Form.Control
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={handleQuestionChange}
              className="question-input"
            />
            <Button variant="primary" type="submit" className="submit-btn">
              Submit Question
            </Button>
          </Form.Group>
        </Form>
        </div>
        </header>

        
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If you have entered a query after a long time or if it is a legal document, it may take some time to process your input. Please be patient, and your response will be shown soon.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPopup(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PDFParserReact;

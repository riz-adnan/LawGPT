import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import './UploadPage.css';

const UploadPage = () => {
  const [sentences, setSentences] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const onDrop = (acceptedFiles) => {
    setIsProcessing(true);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      if (file.type === 'application/pdf') {
        extractTextFromPDF(reader.result);
      } else {
        extractTextFromImage(reader.result);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const extractTextFromImage = (dataUrl) => {
    Tesseract.recognize(
      dataUrl,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      processText(text);
    });
  };

  const extractTextFromPDF = async (arrayBuffer) => {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const textPromises = pages.map(async (page) => page.getTextContent());
    const textContents = await Promise.all(textPromises);
    const fullText = textContents.map(content => content.items.map(item => item.str).join(' ')).join(' ');
    processText(fullText);
  };

  const processText = (text) => {
    const sentencesArray = text.match(/[^.!?]+[.!?]+/g) || [text];
    setSentences(sentencesArray);
    localStorage.setItem('sentences', JSON.stringify(sentencesArray));
    setIsProcessing(false);
    setShowModal(true);
    setModalMessage('Text has been successfully extracted and saved.');
  };

  return (
    <Container fluid className="upload-page" style={{ backgroundColor: 'black', color: 'white' }}>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} className="text-center">
          <h1 className="mb-4">Upload PDF or Photo</h1>
          <Dropzone onDrop={onDrop} />
          {isProcessing && (
            <div className="spinner-overlay">
              <Spinner animation="border" variant="light" />
              <div className="spinner-message">Processing...</div>
            </div>
          )}
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed white', padding: '20px', borderRadius: '10px' }}>
      <input {...getInputProps()} />
      <p>Drag & drop a file here, or click to select a file</p>
    </div>
  );
};

export default UploadPage;

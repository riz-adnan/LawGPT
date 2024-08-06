import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaFileContract, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import {Tilt} from 'react-tilt';
import { Element } from 'react-scroll';
import {Link} from 'react-router-dom'
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Particles
        className="particles"
        params={{
          particles: {
            number: { value: 100 },
            size: { value: 3 },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
            },
          },
        }}
      />
      <Container fluid className="text-center d-flex flex-column justify-content-center">
        <motion.h1 
          className="mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontSize: '4rem' }}
        >
          Welcome to Law Buddy
        </motion.h1>
        <motion.p 
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontSize: '1.5rem' }}
        >
          Your trusted partner for legal assistance
        </motion.p>
        <Row className="justify-content-center mb-5">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Tilt className="Tilt" options={{ max: 25 }}>
                <Link to="/pdfparser" smooth={true} duration={1000}>
                  <Button variant="primary" size="lg" className="w-100 custom-button" style={{ fontSize: '1.5rem' }}>
                    <FaFileContract className="me-2" /> Understand your legal document
                  </Button>
                </Link>
              </Tilt>
            </motion.div>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Tilt className="Tilt" options={{ max: 25 }}>
                <Link to="/chat" smooth={true} duration={1000}>
                  <Button variant="secondary" size="lg" className="w-100 custom-button" style={{ fontSize: '1.5rem' }}>
                    <FaRobot className="me-2" /> Chat with your AI-Lawyer
                  </Button>
                </Link>
              </Tilt>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Element name="explanation1" className="element">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2>Understand your legal document</h2>
            <p>
              This feature helps you understand complex legal documents with ease. Upload your document, and ask any question our AI-powered tool will break down the legal jargon into simple, understandable language and will answer you in understandable language.
            </p>
          </motion.div>
        </Element>

        <Element name="explanation2" className="element">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2>Chat with your AI-Lawyer</h2>
            <p>
              Chat with our AI-Lawyer to get instant legal advice on various matters. Our AI is trained on vast amounts of legal data to provide accurate and helpful guidance. Select your country to get country-specific legal advice. ( Currently only India is supported )
            </p>
          </motion.div>
        </Element>

        <Element name="lawStudents" className="element">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2>Created with Love by <Link to = "https://github.com/riz-adnan">Adnan</Link></h2>
            <p>Share this with your friends and use it to get free Legal help. </p>
          </motion.div>
        </Element>
      </Container>
    </div>
  );
};

export default LandingPage;

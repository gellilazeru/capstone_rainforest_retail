// RegionalHub.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Map from './Map';
import './styles/RegionalHub.css';

const RegionalHub = ({ handleGetCluster }) => {
    // State variables
    const [hub, setHub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchRegionalHub = async () => {
            try {
                setLoading(true);
                // Fetch data for the specific regional hub based on the id parameter
                const response = await fetch(`http://localhost:8080/regional-hubs/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHub(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching regional hub:", error);
                setError("Failed to load regional hub data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRegionalHub();
    }, [id]); // Re-run the effect when the id changes

    // Render loading state
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    // Render if no data is available
    if (!hub) {
        return <div className="text-center mt-5">No data available for this regional hub.</div>;
    }

    // Main render
    return (
        <Container className="mt-4 regional-hub">
            <h1 className="mb-4 regional-hub__title text-center">{hub.region} Regional Hub</h1>
            
            <Row className="mb-4">
                <Col>
                    <Card className="regional-hub__map-card">
                        <Card.Body>
                            {/* Pass the hub id to the Map component */}
                            <Map handleGetCluster={() => handleGetCluster(hub.id)} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="regional-hub__details-card">
                        <Card.Header as="h5">Hub Details</Card.Header>
                        <Card.Body>
                            <p>Address: {hub.addressModel.line}</p>
                            <p>Postcode: {hub.addressModel.postcode}</p>
                            <p>Latitude: {hub.addressModel.latitude}</p>
                            <p>Longitude: {hub.addressModel.longitude}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="regional-hub__stats-card">
                        <Card.Header as="h5">Delivery Stats</Card.Header>
                        <Card.Body>
                            {/* These stats should ideally be fetched from the backend */}
                            <p>Total Orders: {hub.orders ? hub.orders.length : 0}</p>
                            <p>Delivered: {hub.orders ? hub.orders.filter(order => order.deliveryStatus === 'DELIVERED').length : 0}</p>
                            <p>In Transit: {hub.orders ? hub.orders.filter(order => order.deliveryStatus === 'OUT_FOR_DELIVERY').length : 0}</p>
                            <p>Pending: {hub.orders ? hub.orders.filter(order => order.deliveryStatus === 'NOT_DELIVERED').length : 0}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Card className="regional-hub__action-card">
                        <Card.Body className="text-center">
                            <Button 
                                variant="primary" 
                                className="me-2 regional-hub__button" 
                                onClick={() => handleGetCluster(hub.id)}
                            >
                                Get Clusters
                            </Button>
                            <Button variant="secondary" className="regional-hub__button">
                                Optimize Routes
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegionalHub;
// Login.js:
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge, Spinner, Col} from 'react-bootstrap';
import Marquee from "react-fast-marquee";
import axios from 'axios';
import AuctionCard from "./AuctionCard.js"

const API_URL = process.env.REACT_APP_API_URL;

function AuctionMarquee({auctionList = null}) {
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [showSpinner, setShowSpinner] = useState(true)
  const [errors, setErrors] = useState('');
  const [auctions, setAuctions] = useState(auctionList)
  const [loading, setLoading] = useState(true)

  const { token } = useParams();

  const fetchAuctions = async () => {
    try {
      const auctionListResponse = await axios.get(`${API_URL}/market/recent-auctions?num=10`);
      setAuctions(auctionListResponse.data)
      setLoading(false)
    } catch (error) {

    }
  }

  useEffect(() => {
    if (!auctions) {
      fetchAuctions();
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log(auctions)
  }, [auctions])

  return (
    <Container fluid className="text-light justify-content-center align-items-center">
      {!loading &&
        <Marquee style={{overflow: "hidden", height: "100%"}} speed={100}
          className="vw-100" autoFill
          >
        <div className="text-light d-flex">
          {Array.from(auctions).map((item) => (
            <div style={{maxHeight: "300px", margin:"0 0 0 30px"}}>
              <AuctionCard
                item={item}
                ownAuction={true}
                onClick={()=>{}}
              >
              </AuctionCard>
            </div>
          ))}
        </div>
      </Marquee>}
    </Container>
  );
}

export default AuctionMarquee;
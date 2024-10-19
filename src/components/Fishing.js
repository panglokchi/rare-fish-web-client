import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Nav, Navbar, NavDropdown, Offcanvas, Alert, ProgressBar, Row, Col, Badge, Spinner, InputGroup, Form} from 'react-bootstrap';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import FishCard from "./FishCard"
import FishInfoSheet from "./FishInfoSheet"
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';
import { sortFish } from '../utils/utils';
const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Fishing() {
  const [userData, setUserData] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [expNeeded, setExpNeeded] = useState({
    lastLevelExp: 100,
    nextLevelExp: 105
  });
  const [fishList, setFishList] = useState([]);
  const [fishInfo, setFishInfo] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [showFishInfo, setShowFishInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    };
  
    //console.log(config)
  
    try {
      const userDataResponse = await axios.get(`${API_URL}/user/`, config);
      const playerDataResponse = await axios.get(`${API_URL}/user/player`, config);
      const expNeededResponse = await axios.get(`${API_URL}/player/get-xp-needed/`, config);
      //const fishListResponse = await axios.get(`${API_URL}/player/${playerDataResponse.data._id}/fishes`, config);
      setUserData(userDataResponse.data);
      setPlayerData(playerDataResponse.data);
      setExpNeeded(expNeededResponse.data)
      //setFishList(fishListResponse.data)
      //console.log(fishListResponse.data)
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const goToPage = (path) => {
    navigate(path)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const fishOnce = async () => {
    try {
      setFishList([])
      setDisableButtons(true);
      setShowSpinner(true)
      const fishListResponse = await axios.post(`${API_URL}/player/go-fishing`, {"world": "W1"}, config);
      //console.log(fishListResponse);
      await fetchData()
      setShowSpinner(false)
      setTimeout(()=>{setDisableButtons(false)}, 1000)
      setFishList(fishListResponse.data)
    } catch (error) {
      setMessage({status: "warning", message: "Not enough 🦐"})
      setTimeout(()=>{setDisableButtons(false)}, 1000)
    }
  }

  const fishTenTimes = async () => {
    try {
      setFishList([])
      setDisableButtons(true);
      setShowSpinner(true)
      const fishListResponse = await axios.post(`${API_URL}/player/go-fishing`, {"world": "W1", "times": 10}, config);
      await fetchData()
      await new Promise(res => setTimeout(res, 1000))
      setShowSpinner(false)
      setTimeout(()=>{setDisableButtons(false)}, 3000)
      setFishList(fishListResponse.data)
    } catch (error) {
      setMessage({status: "warning", message: "Not enough 🦐"})
      setTimeout(()=>{setDisableButtons(false)}, 3000)
      setShowSpinner(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
      <Container fluid className="text-light p-0 m-0" data-bs-theme="dark">
        <TopNavbar userData={userData} playerData={playerData}></TopNavbar>
        <BottomFooter playerData={playerData} expNeeded={expNeeded}/>
        <Container className="py-0 py-sm-2 px-0 px-sm-1" style={{maxHeight: "100%"}}>
          <Card className="mt-2 pb-2 overflow-y-auto" style={{maxHeight: "100%"}}>
            <Card.Body className={"mh-100 p-2 pt-1 p-sm-3 pt-sm-2 overflow-y-auto"} style={{maxHeight: "100%"}}>
              <Card.Text className="overflow-y-auto">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <div><h5 className="m-0 py-2">Go Fishing</h5></div>
                  <div>
                    <Alert className="m-0 p-2" variant={message.status} show={message.status != "secondary"}>
                      {message.message}
                    </Alert>
                  </div>
                  <div>
                    <InputGroup style={{width:"120px"}} className="m-0">
                      <InputGroup.Text id="basic-addon1" className="p-1 px-md-2">🦐</InputGroup.Text>
                      <Form.Control
                        style={{textAlign: "right"}}
                        aria-label="bait-amount"
                        aria-describedby="basic-addon1"
                        value={playerData.bait}
                        disabled
                        as="input"
                        htmlSize={1}
                      />
                    </InputGroup>
                  </div>
                </div>
                <Stack direction='horizontal'>
                  <Button variant="secondary" size="lg" className="w-50 me-2 mb-2"
                    onClick={()=>{fishOnce()}} disabled={disableButtons}>
                  🎣×1 🦐×1
                  </Button>
                  <Button variant="primary" size="lg" className="w-50 ms-2 mb-2"
                    onClick={()=>{fishTenTimes()}} disabled={disableButtons}>
                  🎣×10 🦐×10
                  </Button>
                </Stack>
                {showSpinner && <Container fluid>
                  <div className="text-center py-3">
                    <h1 className="display-7">
                      <Spinner animation="border" size='lg'/>
                    </h1>
                  </div>
                </Container>}
                <style type="text/css">
                    {`
                      .card#fish-card:hover {
                        border: 1px solid #777;
                        filter: brightness(130%)
                      }
                    `}
                  </style>
                <FishInfoSheet show={showFishInfo} onHide={() => setShowFishInfo(false)} item={fishInfo} ownFish={false}/>
                <div className="p-0 overflow-y-auto overflow-x-hidden" style={{maxHeight: "55vh"}}>
                  <Row xs={2} sm={2} md={2} lg={3} xl={5} className="g-4 overflow-y-auto">
                    {Array.from(fishList).sort(sortFish).map((item) => (
                      <Col key={item.key}>
                          <FishCard
                            id="fish-card"
                            style={{ cursor: "pointer", height: "100%"}}
                            item={item}
                            onClick={()=>{
                              setShowFishInfo(true)
                              setFishInfo(item)
                              //console.log(fishInfo)
                            }}
                          />
                      </Col>
                    ))}
                  </Row>
                </div>
                  
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>

      </Container>
  );
}


export default Fishing;
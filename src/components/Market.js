import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Nav, Navbar, NavDropdown, Offcanvas, Alert, ProgressBar, Row, Col, Badge, Pagination, CardGroup, ListGroup, Placeholder, Form, InputGroup} from 'react-bootstrap';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import FishCard from "./FishCard"
import FishInfoSheet from "./FishInfoSheet"
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';
import AuctionCard from './AuctionCard';
const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Market() {
  const [userData, setUserData] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [expNeeded, setExpNeeded] = useState({
    lastLevelExp: 100,
    nextLevelExp: 105
  });
  const [fishInfo, setFishInfo] = useState(null);
  const [showOwnFishInfo, setShowOwnFishInfo] = useState(false);
  const [showFishInfo, setShowFishInfo] = useState(false);
  const [auctionList, setAuctionList] = useState([]);
  const [ownFinishedAuctionList, setOwnFinishedAuctionList] = useState([]);
  const [wonAuctionList, setWonAuctionList] = useState([]);
  const [winningAuctionList, setWinningAuctionList] = useState([]);
  const [lostAuctionList, setLostAuctionList] = useState([]);
  const [losingAuctionList, setLosingAuctionList] = useState([]);
  const [currentTab, setCurrentTab] = useState(
    sessionStorage.getItem("marketTab") ?
    sessionStorage.getItem("marketTab") : 
    "own");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const paginationElements = [4,4,4,6,8,10]

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const fetchAuctionList = async () => {
    //console.log('fetch auction list')
    const auctionListResponse = await axios.get(`${API_URL}/market/auctions`, config);
    setAuctionList(auctionListResponse.data)
    const wonAuctionListResponse = await axios.get(`${API_URL}/market/won-auctions`, config);
    setWonAuctionList(wonAuctionListResponse.data)
    const winningAuctionListResponse = await axios.get(`${API_URL}/market/winning-auctions`, config);
    setWinningAuctionList(winningAuctionListResponse.data)
    const ownFinishedAuctionListResponse = await axios.get(`${API_URL}/market/own-finished-auctions`, config);
    setOwnFinishedAuctionList(ownFinishedAuctionListResponse.data)
    const lostAuctionListResponse = await axios.get(`${API_URL}/market/lost-auctions`, config);
    setLostAuctionList(lostAuctionListResponse.data)
    const losingAuctionListResponse = await axios.get(`${API_URL}/market/losing-auctions`, config);
    setLosingAuctionList(losingAuctionListResponse.data)
  }

  const updatePlayerData = async () => {
    const playerDataResponse = await axios.get(`${API_URL}/user/player`, config);
    setPlayerData(playerDataResponse.data);
  }

  const fetchData = async () => {
  
    //console.log(config)
  
    try {
      //console.log('fetch')
      updatePlayerData();
      const userDataResponse = await axios.get(`${API_URL}/user/`, config);
      const expNeededResponse = await axios.get(`${API_URL}/player/get-xp-needed`, config);
      setUserData(userDataResponse.data);
      setExpNeeded(expNeededResponse.data)
      fetchAuctionList();
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



  const getPaginationElement = () => {
    return (
      null
      /*
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Item>{11}</Pagination.Item>
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Item>{13}</Pagination.Item>
        <Pagination.Item disabled>{14}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Item>{20}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
      // TO DO
      */
    )
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
      <Container fluid className="text-light p-0" data-bs-theme="dark">
        <TopNavbar userData={userData} playerData={playerData}></TopNavbar>
        <BottomFooter playerData={playerData} expNeeded={expNeeded}/>
        <Container className="py-0 py-sm-2 px-0 px-sm-1">
          <Card className="mt-2 pb-2">
            <Card.Header className="px-3 px-sm-3">
              <Nav fill variant="tabs" defaultActiveKey={
                sessionStorage.getItem("marketTab") ? 
                sessionStorage.getItem("marketTab") : 
                "own"}>
                <Nav.Item>
                  <Nav.Link className="px-1 px-sm-3" eventKey="own" onClick={()=>{
                    setCurrentTab("own");
                    sessionStorage.setItem("marketTab", "own")
                  }}>💰Your Auctions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="px-1 px-sm-3" eventKey="other" onClick={()=>{
                    setCurrentTab("other");
                    sessionStorage.setItem("marketTab", "other");
                  }}>📈Current</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="px-1 px-sm-3" eventKey="finished" onClick={()=>{
                    setCurrentTab("finished");
                    sessionStorage.setItem("marketTab", "finished");
                  }}>⌛Finished</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body className={"mh-100 p-2 p-sm-3"}>
            <FishInfoSheet id="own-auction-fish-modal" show={showOwnFishInfo}
              onHide={() => setShowOwnFishInfo(false)} item={fishInfo}  ownFish={false}/>
            <FishInfoSheet id="other-auction-fish-modal" show={showFishInfo}
              onHide={() => setShowFishInfo(false)} item={fishInfo} ownFish={false}/>
              <Card.Text>
                {currentTab == "own" && <>
                  <Stack direction='horizontal' className="">
                    <div><h5></h5></div>
                    <div className="ms-auto">{getPaginationElement()}</div>
                  </Stack>
                  <div className="overflow-y-auto overflow-x-hidden mb-2 pe-0 pe-md-2" style={{}}>
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                      `}
                    </style>
                    <Container className="px-0" style={{maxHeight: "55vh"}}>
                      <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={2} className="g-2">
                        {Array.from(auctionList).filter((item)=>{
                          if (item.seller.user.username == userData.username) {
                            return true
                          } else return false
                        }).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowOwnFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              ownAuction={true}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                        <Col key={0}>
                          <AuctionCard
                            onClick={()=>{
                              //setShowOwnFishInfo(true)
                              //setFishInfo(item.fish)
                              sessionStorage.setItem("aquariumTab", "inventory")
                              navigate("/aquarium")
                            }}
                            placeholder={true}
                          >
                          </AuctionCard>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </>}
                {currentTab == "other" && <>
                  <Stack direction='horizontal' className="">
                    <div><h5></h5></div>
                    <div className="ms-auto">{getPaginationElement()}</div>
                  </Stack>
                  <div className="overflow-y-auto overflow-x-hidden pe-0 pe-md-2 mb-2">
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                      `}
                    </style>
                    <Container className="px-0" style={{height: "55vh"}}>
                      <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={2} className="g-2">
                        {Array.from(winningAuctionList).map((item) => (
                          <Col key={item._id} >
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              winning={true}
                              updatePlayerData={updatePlayerData}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                        {Array.from(losingAuctionList).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              losing={true}
                              updatePlayerData={updatePlayerData}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                        {Array.from(auctionList).filter((item)=>{
                          if (item.seller.user.username == userData.username) {
                            return false
                          } else if (
                            losingAuctionList.map(item=>{return item._id}).includes(item._id)
                          ) {
                            return false
                          } else if (
                            winningAuctionList.map(item=>{return item._id}).includes(item._id)
                           ) {
                            return false
                           } else return true
                        }).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              updatePlayerData={updatePlayerData}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                      </Row>
                    </Container>
                  </div>
                </>}
                {currentTab == "finished" && <>
                  <Stack direction='horizontal' className="">
                    <div><h5></h5></div>
                    <div className="ms-auto">{getPaginationElement()}</div>
                  </Stack>
                  <div className="overflow-y-auto overflow-x-hidden pe-0 pe-md-2 mb-2" style={{}}>
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                      `}
                    </style>
                    <Container className="px-0" style={{maxHeight: "55vh"}}>
                      <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={2} className="g-2">
                        {Array.from(wonAuctionList).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowOwnFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              status={"won"}
                              updatePlayerData={updatePlayerData}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                        {Array.from(ownFinishedAuctionList).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              status={item.highestBidder ? "sold" : "unsold"}
                              updatePlayerData={updatePlayerData}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                        {Array.from(lostAuctionList).map((item) => (
                          <Col key={item._id}>
                            <AuctionCard
                              item={item}
                              onClick={()=>{
                                setShowFishInfo(true)
                                setFishInfo(item.fish)
                              }}
                              status={"lost"}
                            >
                            </AuctionCard>
                          </Col>
                        ))}
                      </Row>
                    </Container>
                  </div>
                </>}
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>

      </Container>
  );
}


export default Market;
import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Nav, Navbar, NavDropdown, Offcanvas, Alert, ProgressBar, Row, Col, Badge, Pagination, Modals, InputGroup, Form} from 'react-bootstrap';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import FishCard from "./FishCard"
import FishInfoSheet from "./FishInfoSheet"
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';
const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Aquarium() {
  const [userData, setUserData] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [expNeeded, setExpNeeded] = useState({
    lastLevelExp: 100,
    nextLevelExp: 105
  });
  const [fishList, setFishList] = useState([]);
  const [fishInfo, setFishInfo] = useState(null);
  const [aquariumList, setAquariumList] = useState([]);
  const [aquariumScore, setAquariumScore] = useState(0);
  const [aquariumCollectResult, setAquariumCollectResult] = useState({status: "secondary", message: null});
  const [showFishInfo, setShowFishInfo] = useState(false);
  const [currentTab, setCurrentTab] = useState(
    sessionStorage.getItem("aquariumTab") ?
    sessionStorage.getItem("aquariumTab") : 
    "aquarium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const paginationElements = [4,4,4,6,8,10]

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const updatePlayerData = async () => {
    const playerDataResponse = await axios.get(`${API_URL}/user/player`, config);
    setPlayerData(playerDataResponse.data);
    return playerDataResponse
  }

  const fetchFish = async (playerDataResponse) => {
    const aquariumListResponse = await axios.get(`${API_URL}/aquarium/`, config);
    setAquariumList(aquariumListResponse.data)
    const fishListResponse = await axios.get(`${API_URL}/player/${playerDataResponse.data._id}/fishes`, config);
    setFishList(fishListResponse.data)
    const aquariumScoreResponse = await axios.get(`${API_URL}/aquarium/score`, config);
    setAquariumScore(aquariumScoreResponse.data)
  }

  const fetchData = async () => {
    //console.log(config)
  
    try {
      const playerDataResponse = await updatePlayerData();
      const userDataResponse = await axios.get(`${API_URL}/user/`, config);
      const expNeededResponse = await axios.get(`${API_URL}/player/get-xp-needed/`, config);
      await fetchFish(playerDataResponse)
      setUserData(userDataResponse.data);
      setExpNeeded(expNeededResponse.data)
      //console.log(fishListResponse.data)
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleCollectAquarium = async () => {
    try {
      const collectAquariumResponse = await axios.post(`${API_URL}/aquarium/collect`, {
      }, config)
      setAquariumCollectResult({
        status: "success",
        message: "+$" + collectAquariumResponse.data.amount
      })
      updatePlayerData();
    } catch (error) {
      setAquariumCollectResult({
        status: "warning",
        message: error.response.data.error
      })
    }
  }

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

  const getFishInfo = () => {

  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
      <div className="text-light p-0 d-flex flex-column vh-100 justify-content-space-between" data-bs-theme="dark">
        <TopNavbar userData={userData} playerData={playerData} sticky={false}></TopNavbar>
        <div className="flex-grow-1" style={{maxHeight: "85%"}}>
          <Container className="py-2" style={{height: "100%"}}>
            <Card className="" style={{height: "80%"}}>
            <Card.Header>
                <Nav variant="tabs" defaultActiveKey={
                  sessionStorage.getItem("aquariumTab") ? 
                  sessionStorage.getItem("aquariumTab") : 
                  "aquarium"}>
                  <Nav.Item>
                    <Nav.Link eventKey="aquarium" onClick={()=>{
                      setCurrentTab("aquarium");
                      sessionStorage.setItem("aquariumTab", "aquarium")
                    }}>🛁Aquarium</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="inventory" onClick={()=>{
                      setCurrentTab("inventory");
                      sessionStorage.setItem("aquariumTab", "inventory");
                    }}>📦Inventory</Nav.Link>
                  </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body className={"mh-100 p-2 p-sm-3 overflow-y-auto"} style={{maxHeight: "100%"}}>
              { currentTab == "aquarium" &&
                <>
                  <Stack direction='horizontal' className="">
                    <div>
                      <Stack direction='horizontal' className="gap-2">
                        <InputGroup style={{width:"95px"}}>
                        <InputGroup.Text id="basic-addon1" className="p-1 px-md-2">🐠</InputGroup.Text>
                        <Form.Control
                          aria-label="fish-amount"
                          aria-describedby="basic-addon1"
                          value={`${aquariumList.length}/${playerData.aquarium_level + 2}`}
                          disabled
                          as="input"
                          htmlSize={1}
                        />
                        </InputGroup>
                        <InputGroup style={{width:"110px"}}>
                          <InputGroup.Text id="basic-addon1" className="p-1 px-md-2">🎉</InputGroup.Text>
                          <Form.Control
                            aria-label="fish-amount"
                            aria-describedby="basic-addon1"
                            value={aquariumScore > 1000 ? (aquariumScore/1000).toFixed(1) + "k": aquariumScore}
                            disabled
                          />
                        </InputGroup>
                      </Stack>
                    </div>
                    <div className="ms-auto">
                      <Stack direction='horizontal' className="">
                        <InputGroup style={{width:"150px"}} className="d-flex d-sm-none">
                          <InputGroup.Text id="basic-addon1" className="p-1 px-md-2">💰</InputGroup.Text>
                          <Form.Control
                            style={{textAlign: "right"}}
                            aria-label="fish-amount"
                            aria-describedby="basic-addon1"
                            value={playerData.aquarium_money > 1000 ? (playerData.aquarium_money/1000).toFixed(2) + "k" : playerData.aquarium_money}
                            disabled
                            as="input"
                            htmlSize={1}
                          />
                          <Button className="py-1 px-2" variant="success" onClick={()=>{handleCollectAquarium()}}>
                            📥
                          </Button>
                        </InputGroup>
                        <Alert className="d-none d-sm-flex my-0 mx-1 p-1" variant={aquariumCollectResult.status}
                          show={aquariumCollectResult.status != "secondary"}
                        >
                          {aquariumCollectResult.message}
                        </Alert>
                        <InputGroup style={{width:"240px"}} className="d-none d-sm-flex">
                          <InputGroup.Text id="basic-addon1" className="p-1 px-md-2">💰</InputGroup.Text>
                          <Form.Control
                            style={{textAlign: "right"}}
                            aria-label="fish-amount"
                            aria-describedby="basic-addon1"
                            value={
                              `${playerData.aquarium_money > 1000 ? (playerData.aquarium_money/1000).toFixed(2) + "k" : playerData.aquarium_money} / ${
                                playerData.aquarium_level == 1 ? "10k" :
                                playerData.aquarium_level == 2 ? "30k" :
                                playerData.aquarium_level == 3 ? "50k" :
                                playerData.aquarium_level == 4 ? "100k" :
                                playerData.aquarium_level == 5 ? "250k" : "-"
                              }`
                            } 
                            disabled
                            as="input"
                            htmlSize={1}
                          />
                          <Button className="p-1 px-2" variant="success" onClick={()=>{handleCollectAquarium()}}>
                              Collect
                          </Button>
                        </InputGroup>
                        
                      </Stack>
                    </div>
                  </Stack>

                  <ProgressBar now={playerData.aquarium_money/10000*100} variant={"warning"} className="my-2">
                  </ProgressBar>

                  <div className="overflow-y-auto overflow-x-hidden" style={{maxHeight: "55vh"}}>
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                      `}
                    </style>
                    <FishInfoSheet show={showFishInfo} onHide={() => setShowFishInfo(false)}
                      item={fishInfo} player={playerData} updatePlayerData={()=>updatePlayerData()}
                        fetchData={()=>{fetchData()}}
                      />
                    <Row xs={2} sm={2} md={2} lg={3} xl={4} xxl={5} className="g-3">
                      {Array.from(fishList).filter((item)=>{
                        if (Array.from(aquariumList).map((item)=>{return item.fish}).includes(item._id)) {
                          return true
                        } else return false
                      }).map((item) => (
                        <Col key={item._id}>
                          <FishCard
                            id="fish-card"
                            style={{ cursor: "pointer", height: "100%"}}
                            item={item}
                            aquarium={true}
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
                </>
              }
              { currentTab == "inventory" &&
                <>
                  <Stack direction='horizontal' className="d-none">
                    <div><h5></h5></div>
                    <div className="ms-auto">{getPaginationElement()}</div>
                  </Stack>
                  <div className="d-flex d-sm-none overflow-y-auto overflow-x-hidden p-0"
                    id="mobile-card-grid"
                    style={{scrollbarWidth: "none", maxHeight: "55vh"}}
                  >
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                        #mobile-card-grid::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    {/*scrollbarWidth for firefox, -webkit-scrollbar for safari and chrome */}
                    <FishInfoSheet show={showFishInfo} onHide={() => setShowFishInfo(false)}
                      item={fishInfo} player={playerData} updatePlayerData={()=>updatePlayerData()}
                        fetchData={()=>{fetchData()}}
                      />
                    <Row xs={2} sm={2} md={2} lg={3} xl={4} xxl={5} className="g-2">
                      {Array.from(fishList).filter((item)=>{
                        if (Array.from(aquariumList).map((item)=>{return item.fish}).includes(item._id)) {
                          return false
                        } else return true
                      }).map((item) => (
                        <Col key={item._id}>
                          
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
                  <div className="d-none d-sm-flex overflow-y-auto overflow-x-hidden"
                    /*style={{height: "60vh"}}*/
                    style={{maxHeight: "55vh"}}
                  >
                    <style type="text/css">
                      {`
                        .card#fish-card:hover {
                          border: 1px solid #777;
                          filter: brightness(130%)
                        }
                      `}
                    </style>
                    <FishInfoSheet show={showFishInfo} onHide={() => setShowFishInfo(false)}
                      item={fishInfo} player={playerData} updatePlayerData={()=>updatePlayerData()}
                        fetchData={()=>{fetchData()}}
                      />
                    <Container className="p-0 overflow-y-hidden overflow-x-hidden">
                      <Row xs={2} sm={2} md={2} lg={3} xl={4} xxl={5} className="g-3 overflow-y-hidden overflow-x-hidden">
                        {Array.from(fishList).filter((item)=>{
                          if (Array.from(aquariumList).map((item)=>{return item.fish}).includes(item._id)) {
                            return false
                          } else return true
                        }).map((item) => (
                          <Col key={item._id}>
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
                    </Container>
                  </div>
                  
                </>
              }


            </Card.Body>              
            </Card>
          </Container>
        </div>
        <BottomFooter className="d-block d-sm-none" playerData={playerData} expNeeded={expNeeded}/>
        <BottomFooter className="d-none d-sm-block" playerData={playerData} expNeeded={expNeeded} fixed={false}/>
      </div>
  );
}


export default Aquarium;
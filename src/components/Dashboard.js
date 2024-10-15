import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Nav, Navbar, NavDropdown, Offcanvas, Alert, ProgressBar } from 'react-bootstrap';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';
const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Dashboard() {
  const [userData, setUserData] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [expNeeded, setExpNeeded] = useState({
    lastLevelExp: 100,
    nextLevelExp: 105
  });
  const [missions, setMissions] = useState([]);
  const [showFacts, setShowFacts] = useState(true);
  const [missionRewards, setMissionRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const fetchData = async () => {

    //console.log(config)
  
    try {
      const userDataResponse = await axios.get(`${API_URL}/user/`, config);
      const playerDataResponse = await axios.get(`${API_URL}/user/player`, config);
      //console.log(userDataResponse.data)
      const expNeededResponse = await axios.get(`${API_URL}/player/get-xp-needed/`, config);
      const missionsResponse = await axios.get(`${API_URL}/player/get-missions/`, config);
      //console.log("Response received")
      //console.log(response.data)
      //console.log(expNeededResponse.data)
      setUserData(userDataResponse.data);
      setPlayerData(playerDataResponse.data);
      setExpNeeded(expNeededResponse.data)
      setMissions(missionsResponse.data);
      //console.log(parseInt(100*(playerData.exp - expNeeded.lastLevelExp)/(expNeeded.nextLevelExp - expNeeded.lastLevelExp)))
    } catch (error) {
      if (error.response.data.error == ("Player not found")) {
        navigate("/login")
        // player not created yet
      }
      setError(error.message);
    }

    setLoading(false);
  };

  const goToPage = (path) => {
    navigate(path)
  }

  const claimMission = async (mission) => {
    const claimMissionResponse = await axios.post(`${API_URL}/missions/claim`,
      { mission: mission }, config);
    console.log(claimMissionResponse)
    fetchData();
    setMissionRewards(claimMissionResponse.data)
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (missionRewards && missionRewards.map((item)=>{
      console.log(item)
    }))
  }, [missionRewards]);

  const getIcon = (item) => {
    return (
        item == "bait" ? '🦐' :
        item == "kelp" ? '🌿' :
        item == "money" ? '💰' : '📦'
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
        <TopNavbar userData={userData} playerData={playerData}/>
        <BottomFooter playerData={playerData} expNeeded={expNeeded}/>
        <Container>
          <Card className="mt-2">
            <Card.Body className="p-2 p-sm-3 pb-2">

                <Alert variant="info" show={showFacts} className="p-2 p-sm-3">
                  <Alert.Heading>Fantastic Fish Facts</Alert.Heading>
                  <hr/>
                  <p>
                    Did you know the Spotted Garden Eel can grow up to 40 centimetres?
                  </p>
                  <div className="d-flex justify-content-end">
                    <Button onClick={() => {setShowFacts(false)}} variant="outline-info">
                      Fascinating
                    </Button>
                  </div>
                </Alert>
                <div className="d-flex justify-content-between mb-0 align-items-center">
                  <Card.Title>
                    <h4>Daily Missions</h4>
                  </Card.Title>
                  <div className="d-flex flex-columns">
                    {missionRewards && missionRewards.map((item)=>(
                      <Alert className="p-1 mb-1 ms-1" variant="success" show={true}>
                        {`+${getIcon(item.item)}×${item.amount}`}
                      </Alert>
                    ))}
                  </div>
                </div>
                <Stack direction="vertical" gap={1} style={{maxHeight: "55vh", overflowY: "auto"}}>
                {Array.from(missions).map((item) => (
                  <Alert variant="light" className="p-2 p-sm-3 mb-1 d-block d-sm-none"
                    style={{fontSize: "0.9rem"}}
                  >
                    <Alert.Heading style={{fontSize: "1.1rem"}}>{item.name}</Alert.Heading>
                    <div className="d-flex d-column justify-content-between">
                      <div style={{fontSize: "0.9rem"}}>
                        {item.description}
                      </div>
                      <div>
                        {Array.from(item.objectives).map((item) => (
                          <div>{item.progress}/{item.target} - {item.name}</div>
                          ))
                        }
                      </div>
                    </div>
                    <hr className="my-2"/>
                    <div className="d-flex d-column justify-content-between align-items-center">
                      <div>
                        {Array.from(item.reward).map((item) => (
                          <div style={{display: "inline"}}>{
                            item.item == "bait" ? '🦐' :
                            item.item == "kelp" ? '🌿' :
                            item.item == "money" ? '💰' : item.item
                            } × {item.amount} </div>
                        ))
                        }
                      </div>
                      <Button size="sm" onClick={() => {claimMission(item._id)}} variant={item.complete ? "success" : "secondary"} disabled={!item.complete}>
                        Complete
                      </Button>
                    </div>
                      
                    {/*<p>
                      Expiry: {item.expiry?.split("T")[0]} {item.expiry?.split("T")[1].slice(0,5)}
                    </p>*/}
                  </Alert>
                ))}
                {Array.from(missions).map((item) => (
                  <Alert variant="light" className="p-2 p-sm-3 mb-1 d-none d-sm-block">
                    <Alert.Heading>{item.name}</Alert.Heading>
                    <div className="d-flex d-column justify-content-between">
                      <div>
                        {item.description}
                      </div>
                      <div>
                        {Array.from(item.objectives).map((item) => (
                          <div>{item.progress}/{item.target} - {item.name}</div>
                          ))
                        }
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex d-column justify-content-between align-items-center">
                      <div>
                        {Array.from(item.reward).map((item) => (
                          <div style={{display: "inline"}}>{
                            item.item == "bait" ? '🦐' :
                            item.item == "kelp" ? '🌿' :
                            item.item == "money" ? '💰' : item.item
                            } × {item.amount} </div>
                        ))
                        }
                      </div>
                      <Button onClick={() => {claimMission(item._id)}} variant={item.complete ? "success" : "secondary"} disabled={!item.complete}>
                        Complete
                      </Button>
                    </div>
                      
                    {/*<p>
                      Expiry: {item.expiry?.split("T")[0]} {item.expiry?.split("T")[1].slice(0,5)}
                    </p>*/}
                  </Alert>
                ))}

                </Stack>
  
            </Card.Body>
          </Card>
        </Container>

      </Container>
  );
}


export default Dashboard;
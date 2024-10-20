import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Alert, Spinner, Badge} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';
const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Missions({updatePlayerData = null}) {
  const [missions, setMissions] = useState([]);
  const [showFacts, setShowFacts] = useState(true);
  const [missionRewards, setMissionRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disableButtons, setDisableButtons] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const fetchMissions = async () => {

    //console.log(config)
  
    try {
      const missionsResponse = await axios.get(`${API_URL}/player/get-missions/`, config);
      setMissions(missionsResponse.data);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };


  const claimMission = async (mission) => {
    setDisableButtons(true)
    const claimMissionResponse = await axios.post(`${API_URL}/missions/claim`,
      { mission: mission }, config);
    console.log(claimMissionResponse)
    //fetchData();
    updatePlayerData();
    setMissionRewards(claimMissionResponse.data)
    fetchMissions();
    setTimeout(()=>{setDisableButtons(false)}, 1000)
  }

  useEffect(() => {
    fetchMissions();
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
    return (
      <div className="d-flex justify-content-center align-items-center m-5 p-5">
        <Spinner></Spinner>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
  <>
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
        <h4>Missions</h4>
      </Card.Title>
      <div className="d-flex flex-columns">
        {missionRewards && missionRewards.map((item)=>(
          <Alert className="p-1 mb-1 ms-1" variant="success" show={true}>
            {`+${getIcon(item.item)}×${item.amount}`}
          </Alert>
        ))}
      </div>
    </div>
    <Stack direction="vertical" gap={1} style={{maxHeight: "65vh", overflowY: "auto", paddingBottom: "25vh"}}>
    {Array.from(missions).map((item) => (
      <Alert variant="light" className="p-2 p-sm-3 mb-1 d-block d-sm-none"
        style={{fontSize: "0.9rem"}}
      >
        <Alert.Heading style={{fontSize: "1.1rem"}}>
          {item.repeat != null && <Badge bg="secondary" className="me-1">{item.repeat.toUpperCase()}</Badge>}
          {item.name}
        </Alert.Heading>
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
          <Button size="sm" onClick={() => {claimMission(item._id)}} variant={item.complete ? "success" : "secondary"} disabled={ disableButtons || (!item.complete) }>
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
        <Alert.Heading>
          {item.repeat != null && <Badge bg="secondary" className="me-1">{item.repeat.toUpperCase()}</Badge>}
          {item.name}
        </Alert.Heading>
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
          <Button onClick={() => {claimMission(item._id)}}
            variant={item.complete ? "success" : "secondary"} disabled={ disableButtons || (!item.complete) }>
            Complete
          </Button>
        </div>
          
        {/*<p>
          Expiry: {item.expiry?.split("T")[0]} {item.expiry?.split("T")[1].slice(0,5)}
        </p>*/}
      </Alert>
    ))}

    </Stack>
  </>
  );
}


export default Missions;
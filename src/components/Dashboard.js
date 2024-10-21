import React, { useState, useEffect} from 'react';
import { Container, Button, Stack, Card, Nav, Navbar, NavDropdown, Offcanvas, Alert, ProgressBar } from 'react-bootstrap';
import { Route, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import TopNavbar from './TopNavbar';
import BottomFooter from './BottomFooter';

import Missions from './Missions';
import Aquarium from './Aquarium';
import Fishing from './Fishing'
import Market from './Market'

const API_URL = process.env.REACT_APP_API_URL; // Mock API

function Dashboard({currentTab = "home"}) {
  const [userData, setUserData] = useState('');
  const [playerData, setPlayerData] = useState('');
  const [expNeeded, setExpNeeded] = useState({
    lastLevelExp: 100,
    nextLevelExp: 105
  });
  const [tab, setTab] = useState(currentTab);
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
      //console.log("Response received")
      //console.log(response.data)
      //console.log(expNeededResponse.data)
      setUserData(userDataResponse.data);
      setPlayerData(playerDataResponse.data);
      setExpNeeded(expNeededResponse.data)
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

  useEffect(() => {
    fetchData();
  }, []);

  //useEffect(() => {
  //  console.log(tab)
  //}, [tab]);

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
        <TopNavbar userData={userData} playerData={playerData} tab={tab} setTab={setTab}
          updatePlayerData={()=>{fetchData()}}/>
        <BottomFooter playerData={playerData} expNeeded={expNeeded}/>

        { tab == "home" &&
          <>
            <Container className="d-block d-sm-none px-1 pt-2">
              <Missions updatePlayerData={()=>{fetchData()}}></Missions>
            </Container>
            <Container className="d-none d-sm-block">
              <Card className="mt-2">
                <Card.Body className="p-2 p-sm-3 pb-2">
                    <Missions updatePlayerData={()=>{fetchData()}}></Missions>
                </Card.Body>
              </Card>
            </Container>
          </>
        }

        { tab == "aquarium" &&
          <>
            <Container className="d-block d-sm-none p-0">
              <Aquarium updatePlayerData={()=>{fetchData()}} playerData={playerData} small={true}></Aquarium>
            </Container>
            <Container className="d-none d-sm-block">
              <Card className="mt-2">
                  <Aquarium updatePlayerData={()=>{fetchData()}} playerData={playerData}></Aquarium>
              </Card>
            </Container>
          </>
        }

        { tab == "fishing" &&
          <>
            <Container className="d-block d-sm-none p-0">
              <Fishing updatePlayerData={()=>{fetchData()}} playerData={playerData} small={true}></Fishing>
            </Container>
            <Container className="d-none d-sm-block">
              <Card className="mt-2 p-2">
                  <Fishing updatePlayerData={()=>{fetchData()}} playerData={playerData}></Fishing>
              </Card>
            </Container>
          </>
        }

        { tab == "market" &&
          <>
            <Container className="d-block d-sm-none p-0">
              <Market updatePlayerData={()=>{fetchData()}} playerData={playerData} userData={userData}
                small={true} setTab={setTab}
              ></Market>
            </Container>
            <Container className="d-none d-sm-block">
              <Card className="mt-2">
                <Market updatePlayerData={()=>{fetchData()}} playerData={playerData} userData={userData}
                  setTab={setTab}
                ></Market>
              </Card>
            </Container>
          </>
        }

      </Container>
  );
}


export default Dashboard;
import {Button, ButtonGroup, Modal, Stack, Nav, Container, InputGroup, Form, Alert, ProgressBar, Badge} from 'react-bootstrap';
import FishCard from "./FishCard"
import React, { useState, useEffect} from 'react';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Mock API

function FishInfoSheet({show, onHide, item, ownFish = true, player = null, updatePlayerData = null, fetchData = null}) {
  const [tab, setTab] = useState("tab-1");
  const [minimumBid, setMinimumBid] = useState(null);
  const [postAuctionResult, setPostAuctionResult] = useState(null);
  const [postAuctionResultType, setPostAuctionResultType] = useState("secondary")
  const [disablePostButton, setDisablePostButton] = useState(true)
  const [itemState, setItemState] = useState(null)
  const [feedState, setFeedState] = useState({status: "secondary", message: null})
  const [releaseState, setReleaseState] = useState({status: "secondary", message: null})
  const [aquariumState, setAquariumState] = useState(false)
  const [putAquariumResult, setPutAquariumResult] = useState(null)

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const fetchFish = async () => {
    if (item != null) {
      const fishResponse = await axios.get(`${API_URL}/fish/${item._id}`, config)
      //console.log(item)
      setItemState(fishResponse.data)
      setAquariumState(fishResponse.data.aquarium)
    }
  }

  const handleSetMinimumBid = (e) => {
    setMinimumBid(e.target.value)
    setDisablePostButton(false)
  }

  const handlePostAuction = async () => {
    try {
      const postAuctionResponse = await axios.post(`${API_URL}/market/post-auction`, {
        fish: item._id,
        minimumPrice: minimumBid,
        //duration: 20000
      }, config)
      setPostAuctionResult("Auction Created")
      setPostAuctionResultType("success")
      setDisablePostButton(true)
      reset();
      updatePlayerData()
      fetchData()
      onHide();
    } catch (error) {
      setPostAuctionResult(error.response.data.error)
      setPostAuctionResultType("warning")
      setDisablePostButton(false)
    }
  }

  const handleFeedFish = async (times) => {
    try {
      //console.log(times)
      const feedFishResponse = await axios.post(`${API_URL}/fish/feed/${item._id}`, {
        times: times
      }, config)
      setFeedState({
        status: "success",
        message: "+" + feedFishResponse.data.expGained +" XP"
      })
      const fishResponse = await axios.get(`${API_URL}/fish/${item._id}`, config)
      setItemState(fishResponse.data)
      updatePlayerData()
      fetchData()
    } catch (error) {
      setFeedState({
        status: "warning",
        message: error.response.data.error
      })
    }
  }

  const handleReleaseFish = async () => {
    try {
      //console.log(times)
      const releaseFishResponse = await axios.post(`${API_URL}/fish/release/${item._id}`, {

      }, config)
      setReleaseState({
        status: "success",
        message: "+" + releaseFishResponse.data.kelpGained +" XP"
      })
      //const fishResponse = await axios.get(`${API_URL}/fish/${item._id}`, config)
      //setItemState(fishResponse.data)
      reset();
      updatePlayerData()
      fetchData()
      onHide();
    } catch (error) {
      setReleaseState({
        status: "warning",
        message: error.response.data.error
      })
    }
  }

  const handleAddAquarium = async () => {
    try {
      await axios.post(`${API_URL}/aquarium/assign/`, {
        fish: item._id
      }, config)
      fetchFish();
      fetchData();
      onHide();
      reset();
    } catch (error) {
      const putAquariumResultError = error.response.data.error
      setPutAquariumResult(putAquariumResultError)
    }
  }

  const handleRemoveAquarium = async () => {
    await axios.post(`${API_URL}/aquarium/unassign/`, {
      fish: item._id
    }, config)
    fetchFish();
    fetchData();
    onHide();
    reset();
  }

  const reset = () => {
    setTab("tab-1");
    setMinimumBid(null)
    setDisablePostButton(true)
    setPutAquariumResult(null)
    setFeedState({status: "secondary", message: null});
    setReleaseState({status: "secondary", message: null})
    setPostAuctionResult(null)
    setPostAuctionResultType("secondary")
  }

  return (
    <Modal
      className="text-light p-0"
      data-bs-theme="dark"
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      //onEscapeKeyDown={()=>{reset(); onHide()}}
      onHide={()=>{ reset(); onHide() }}
      onShow={()=>{
        setItemState(item)
        fetchFish()
      }}
      >
      <Modal.Header closeButton onClick={()=>{reset(); onHide()}}>
        <Modal.Title className="d-block d-sm-none" id="contained-modal-title-vcenter" style={{fontSize: "1rem"}}>
          Fish Information
        </Modal.Title>
        <Modal.Title className="d-none d-md-block" id="contained-modal-title-vcenter">
          Fish Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 p-md-3">

        <div style={{display: "flex", alignItems: "stretch"}}>
          <FishCard style={{width: "330px", maxWidth: "50%"}} item={item}></FishCard>

          {tab == "tab-1" &&
            <div className="ms-2 ms-md-3 d-flex flex-column" style={{width: "100%"}}>
              <div className="d-block d-sm-none" style={{fontSize: "0.8rem"}}>
                <div className="d-flex justify-content-between">
                  <div>Health</div>
                  <div>{item?.health}/100</div>
                </div>
                <ProgressBar now={itemState?.health} variant={"danger"} ></ProgressBar>
                <div className="d-flex justify-content-between">
                  <div>Level {itemState?.level}</div>
                  <div>{itemState?.exp - itemState?.lastLevelExp}/{itemState?.expRequired  - itemState?.lastLevelExp}</div>
                </div>
                <ProgressBar now={(itemState?.exp - itemState?.lastLevelExp)/(itemState?.expRequired  - itemState?.lastLevelExp)*100} variant={"primary"} ></ProgressBar>
              </div>
              <div className="d-none d-md-block">
                <div className="d-flex justify-content-between">
                  <div>Health</div>
                  <div>{item?.health}/100</div>
                </div>
                <ProgressBar now={itemState?.health} variant={"danger"} ></ProgressBar>
                <div className="d-flex justify-content-between">
                  <div>Level {itemState?.level}</div>
                  <div>{itemState?.exp - itemState?.lastLevelExp}/{itemState?.expRequired  - itemState?.lastLevelExp}</div>
                </div>
                <ProgressBar now={(itemState?.exp - itemState?.lastLevelExp)/(itemState?.expRequired  - itemState?.lastLevelExp)*100} variant={"primary"} ></ProgressBar>
              </div>
              { ownFish && <>
                
                  <div className="d-flex flex-column align-items-end">

                    <div className="d-block d-sm-none"
                      style={{fontSize: "0.8rem", minWidth: "120px", maxWidth: "100%"}}
                    >
                      <InputGroup style={{fontSize: "0.8rem"}} className="d-flex d-sm-none mt-2">
                          <InputGroup.Text id="basic-addon1" className="py-2 px-1" style={{fontSize: "0.9rem"}}>🌿</InputGroup.Text>
                            <Form.Control
                              style={{fontSize: "1rem"}}
                              className="py-0 px-2"
                              aria-label="kelp-amount"
                              aria-describedby="basic-addon1"
                              value={player?.kelp}
                              disabled
                              as="input"
                              htmlSize={1}
                            />
                        </InputGroup>
                    </div>
                    <div className="d-flex d-sm-none align-items-end"
                      style={{fontSize: "0.8rem"}}
                    >
                      <InputGroup style={{fontSize: "0.8rem"}} className="d-flex d-sm-none mt-2 ms-auto">
                        <Button variant="outline-success" className="py-2 px-2" onClick={()=>{handleFeedFish(1)}} style={{fontSize: "0.9rem"}}>
                          🌿×1
                        </Button>
                        <Button variant="outline-success" className="py-2 px-1" onClick={()=>{handleFeedFish(10)}} style={{fontSize: "0.9rem"}}>
                          🌿×10
                        </Button>
                      </InputGroup>
                    </div>
                    <InputGroup className="d-none d-md-flex mt-2 align-self-end" style={{maxWidth: "350px"}}>
                      <InputGroup.Text id="basic-addon1" className="py-2 px-2">🌿</InputGroup.Text>
                      <Form.Control
                        className="py-2 px-2"
                        aria-label="kelp-amount"
                        aria-describedby="basic-addon1"
                        value={player?.kelp}
                        disabled
                        as="input"
                        htmlSize={1}
                      />
                      <Button variant="outline-success" className="py-2 px-3" onClick={()=>{handleFeedFish(1)}}>
                        🌿×1
                      </Button>
                      <Button variant="outline-success" className="py-2 px-3" onClick={()=>{handleFeedFish(10)}}> 
                        🌿×10
                      </Button>
                    </InputGroup>

                  <div className="ms-auto mt-2">
                    <Alert variant={feedState.status} show={feedState.message != null} className="p-2">
                      {feedState.message}
                    </Alert>
                  </div>

                  
                    
                  </div>
                  <div className="mt-auto ms-auto">
                    <Alert variant={"warning"} show={putAquariumResult}>
                      {putAquariumResult}
                    </Alert>
                    { aquariumState ? 
                      <>
                        <Button className="d-flex d-sm-none" size="sm" onClick={()=>{handleRemoveAquarium()}}>
                          Remove from 🛁Aquarium
                        </Button>
                        <Button className="d-none d-md-flex" onClick={()=>{handleRemoveAquarium()}}>
                          Remove from 🛁Aquarium
                        </Button>
                      </>
                       :
                      <>
                        <Button className="d-flex d-sm-none" size="sm" onClick={()=>{handleAddAquarium()}}>
                          Put in 🛁Aquarium
                        </Button> 
                        <Button className="d-none d-md-flex" onClick={()=>{handleAddAquarium()}}>
                          Put in 🛁Aquarium
                        </Button> 
                      </>
                      
                    }
                  </div>
                </>
              }
              
            </div>
          }

        {tab == "tab-2" &&
          <div className="ms-2 ms-md-3 d-flex flex-column align-items-stretch" style={{width: "100%"}}>
            <div className="">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label>
                  Create Auction
                </Form.Label>
                <Badge bg="secondary" className="ms-auto mb-2">
                    5% Fee
                </Badge>
              </div>
              <InputGroup>
                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                <Form.Control
                  type="amount"
                  placeholder="Minimum Bid"
                  // why cant set value ??!!
                  onChange={(e)=>{handleSetMinimumBid(e)}}
                />
                <Button variant="outline-secondary" onClick={()=>{handlePostAuction(item._id)}} disabled={
                  disablePostButton
                }>
                  Post
                </Button>
              </InputGroup>
              { postAuctionResult &&
                <Alert className="mt-2" variant={postAuctionResultType}>
                    {postAuctionResult}
                </Alert>
              }
            </div>
            <div className="mt-auto ms-auto d-flex flex-column justify-content-end">
              <Alert variant={releaseState.status} show={releaseState.message != null} className="p-2">
                {releaseState.message}
              </Alert>
              <Button className="d-flex d-sm-none ms-auto" size="sm" onClick={()=>{handleReleaseFish()}}>
                🌊Release 🌿×{
                  itemState.rarity == "common" ? 20 :
                  itemState.rarity == "rare" ? 40 :
                  itemState.rarity == "epic" ? 80 :
                  itemState.rarity == "legendary" ? 160 : 0
                }
              </Button>
              <Button className="d-none d-md-flex ms-auto"  onClick={()=>{handleReleaseFish()}}>
                🌊Release 🌿×{
                  itemState.rarity == "common" ? 20 :
                  itemState.rarity == "rare" ? 40 :
                  itemState.rarity == "epic" ? 80 :
                  itemState.rarity == "legendary" ? 160 : 0
                }
              </Button>
            </div>
          </div>
        }

      </div>

      </Modal.Body>
      <Modal.Footer className="p-1 p-md-2">
        <Nav variant="pills" defaultActiveKey="tab-1">
          <Nav.Item>
            <Nav.Link eventKey="tab-1" className="px-2 py-1 py-md-2 px-md-3" onClick={()=>{setTab("tab-1")}}>ℹ️Info</Nav.Link>
          </Nav.Item>
          {ownFish &&
            <Nav.Item>
              <Nav.Link eventKey="tab-2" className="px-2 py-1 py-md-2 px-md-3" onClick={()=>{setTab("tab-2")}}>💰Sell</Nav.Link>
            </Nav.Item>
          }
        </Nav>
        <Button className="px-2 py-1 py-md-2 px-md-3" onClick={()=>{reset(); onHide()}} variant="outline-danger">Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FishInfoSheet;
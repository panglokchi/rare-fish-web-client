import { useState, useEffect } from 'react';
import { Card, CardGroup, Badge, Placeholder, Alert, ListGroup, InputGroup, Form, Button } from 'react-bootstrap';
import FishCard from './FishCard';
import axios from 'axios';
import moment from 'moment';
const API_URL = process.env.REACT_APP_API_URL;

function AuctionCard({item, onClick, placeholder = false, ownAuction = false, status = null, losing = false, winning = false , updatePlayerData = null}) {
    const [itemState, setItemState] = useState(item);
    const [bidAmount, setBidAmount] = useState(null);
    const [bidResult, setBidResult] = useState(null);
    const [timeToExpiry, setTimeToExpiry] = useState(null);
    const [expired, setExpired] = useState(false);
    const [expiredSince, setExpiredSince] = useState(null);
    const [losingState, setLosingState] = useState(losing);
    const [winningState, setWinningState] = useState(winning);
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      };
    const handleSetBidAmount = (e) => {
        setBidAmount(e.target.value)
    }
    const handleMakeBid = async () => {
        try {
            const makeBidResponse = await axios.post(`${API_URL}/market/bid`, {
                auction: itemState._id,
                bid: bidAmount,
            }, config);
            const newBidResult = "Bid Successful"
            setBidResult(newBidResult)
            const auctionResponse = await axios.get(`${API_URL}/market/auctions/${item._id}`, config);
            setItemState(auctionResponse.data)
            setBidAmount(Math.ceil(auctionResponse.data.highestBid * 1.05 * 100)/100)
            setLosingState(false)
            setWinningState(true)
        } catch (error) {
            const newBidResult = error.response.data.error
            setBidResult(newBidResult)
        }
        //fetchAuctionList();
        //updatePlayerData();
    }
    const claimAuction = async () => {
        const claimAuction = await axios.post(`${API_URL}/market/claim-auction/${item._id}`, {}, config);
        const auctionResponse = await axios.get(`${API_URL}/market/auctions/${item._id}`, config);
        setItemState(auctionResponse.data)
        //updatePlayerData()
    }
    useEffect(()=>{
        updatePlayerData && updatePlayerData()
    }, [itemState])
    useEffect(()=>{
        itemState && setBidAmount(Math.ceil(itemState.highestBid * 1.05 * 100)/100)
    }, [itemState]);
    setTimeout(() => {
        if (!itemState) return;
        const expiryTime = Date.parse(itemState.expiry)
        const currentTime = Date.now()
        const remainingTime = moment(expiryTime  - currentTime).utc().format("HH:mm:ss")
        setTimeToExpiry(remainingTime)
        if (expiryTime - currentTime < 0) {
            setExpired(true)
            if(!expiredSince) {
                setExpiredSince(moment(expiryTime).fromNow())
            }
        }
    }, 1000)
    return (
        <CardGroup className="h-100 d-flex">
            { !placeholder ?
                <FishCard
                    id="fish-card"
                    style={{ cursor: "pointer", width: "50%", borderRadius: "6px 0 0 6px"}}
                    item={itemState.fish}
                    onClick={()=>{
                        onClick()
                        //setShowFishInfo(true)
                        //setFishInfo(item.fish)
                        //console.log(fishInfo)
                        //change this to one modal per fish?
                    }}
                /> :
                <FishCard
                    id="fish-card"
                    style={{ cursor: "pointer", width: "50%", borderRadius: "6px 0 0 6px"}}
                    //item={item.fish}
                    placeholder={true}
                    icon={"U+1F195"}
                    onClick={()=>{
                    //  setShowFishInfo(true)
                    //  setFishInfo(item.fish)
                    //console.log(fishInfo)
                        onClick()
                    }}
                />
            }
            <Card className="" style={{ width: "60%", borderRadius: "0 6px 6px 0"}}>
                { !placeholder ?
                    <>
                        <Card.Body className="d-flex d-sm-none flex-column justify-content-between p-2 p-md-3"
                            style={{fontSize: "0.8rem"}}>
                            <div>
                            { !ownAuction && <Card.Text className="mb-1">Auction by: {itemState.seller.user.username}</Card.Text>}
                            {
                                itemState.highestBid ?
                                <><Card.Text className="mb-1">Highest Bid: {itemState.highestBid}</Card.Text>
                                <Card.Text className="mb-1">Highest Bidder: {itemState.highestBidder.user.username}</Card.Text>
                                { losingState &&
                                    <Card.Text className="mb-1">Your Bid: {itemState.bid}</Card.Text>
                                }</> :
                                <><Card.Text className="mb-1">Minimum Price: {itemState.minimumPrice}</Card.Text>
                                { status == "unsold" ? 
                                    <Card.Text className="mb-1">No bids</Card.Text> :
                                    <Card.Text className="mb-1">No bids yet</Card.Text>
                                }</>
                            }
                            
                            </div>
                            <div>
                            <Alert
                                className="mb-0 py-1 px-3"
                                show={bidResult != null}
                                variant={
                                    bidResult == "You are already the highest bidder" ? 'primary' :
                                    bidResult == "Bid Successful" ? 'success': 'warning'
                                }
                            >
                                {bidResult}
                            </Alert>
                            </div>
                        </Card.Body>
                        <Card.Body className="d-none d-sm-flex flex-column justify-content-between p-2 p-md-3">
                            <div>
                            { !ownAuction && <Card.Text>Auction by: {itemState.seller.user.username}</Card.Text>}
                            {
                                itemState.highestBid ?
                                <><Card.Text>Highest Bid: {itemState.highestBid}</Card.Text>
                                <Card.Text>Highest Bidder: {itemState.highestBidder.user.username}</Card.Text>
                                { losingState &&
                                    <Card.Text>Your Bid: {itemState.bid}</Card.Text>
                                }</> :
                                <><Card.Text>Minimum Price: {itemState.minimumPrice}</Card.Text>
                                { status == "unsold" ? 
                                    <Card.Text>No bids</Card.Text> :
                                    <Card.Text>No bids yet</Card.Text>
                                }</>
                            }
                            
                            </div>
                            <div>
                            <Alert
                                className="mb-0 py-1 px-3"
                                show={bidResult != null}
                                variant={
                                    bidResult == "You are already the highest bidder" ? 'primary' :
                                    bidResult == "Bid Successful" ? 'success': 'warning'
                                }
                            >
                                {bidResult}
                            </Alert>
                            </div>
                        </Card.Body>
                        { !ownAuction && status == null &&                              
                            <ListGroup className="list-group-flush">
                                {losingState && <ListGroup.Item>
                                    <Badge bg="danger" style={{color: "black"}}>Losing</Badge>
                                </ListGroup.Item>}
                                {winningState && <ListGroup.Item>
                                    <Badge bg="success">Winning</Badge>
                                </ListGroup.Item>}
                                <ListGroup.Item>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                    <Form.Control
                                    type="amount"
                                    placeholder={Math.ceil(itemState.highestBid * 1.05 * 100)/100}
                                    defaultValue={Math.ceil(itemState.highestBid * 1.05 * 100)/100}
                                    // why cant set value ??!!
                                    onChange={(e)=>{handleSetBidAmount(e)}}
                                    />
                                    <Button variant="outline-secondary" onClick={()=>{handleMakeBid()}}>
                                        Bid
                                    </Button>
                                </InputGroup>
                                </ListGroup.Item>
                            </ListGroup>
                        }
                        { status == "won" && <>                        
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item className="py-1 px-2 p-sm-2 px-sm-3">
                                    <Button
                                        variant="primary"
                                        className="d-flex d-sm-none"
                                        size="sm"
                                        onClick={claimAuction}
                                        disabled={itemState.claimed.buyer == true}
                                    >
                                        Claim
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="d-none d-sm-flex"
                                        onClick={claimAuction}
                                        disabled={itemState.claimed.buyer == true}
                                    >
                                        Claim
                                    </Button>
                                </ListGroup.Item>
                                <ListGroup.Item className="py-1 px-2 p-sm-2 px-sm-3">
                                    <Badge bg="success">Won</Badge>
                                    { itemState.claimed.buyer == true &&
                                        <Badge bg="secondary" className="ms-2">Claimed</Badge>
                                    }
                                </ListGroup.Item>
                            </ListGroup>
                            <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                                {expiredSince ? expiredSince :
                                    <Placeholder animation="glow">
                                        <Placeholder xs={6}/>
                                    </Placeholder>
                                }
                            </Card.Footer>
                            </>
                        }
                        { (status == "sold" || status == "unsold") && <>                        
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item className="py-1 px-2 p-sm-2 px-sm-3">
                                    <Button
                                        variant="primary"
                                        className="d-flex d-sm-none"
                                        size="sm"
                                        onClick={claimAuction}
                                        disabled={ itemState.claimed.seller == true }
                                    >
                                        Claim
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="d-none d-sm-flex"
                                        onClick={claimAuction}
                                        disabled={ itemState.claimed.seller == true }
                                    >
                                        Claim
                                    </Button>
                                </ListGroup.Item>
                                <ListGroup.Item className="py-1 px-2 p-sm-2 px-sm-3">
                                    { status == "sold" ?
                                        <Badge bg="warning" style={{color: "black"}}>Sold</Badge> :
                                        <Badge bg="primary">Unsold</Badge>
                                    }
                                    {status == "sold" && 
                                        <Badge bg="secondary" className="ms-2">
                                            5% Fee
                                        </Badge>
                                    }
                                    { itemState.claimed.seller == true &&
                                        <Badge bg="secondary" className="ms-2">Claimed</Badge>
                                    }
                                </ListGroup.Item>
                            </ListGroup>
                            <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                                {expiredSince ? expiredSince :
                                    <Placeholder animation="glow">
                                        <Placeholder xs={6}/>
                                    </Placeholder>
                                }
                            </Card.Footer>
                            </>
                        }
                        { status == "lost" && <>                        
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <Badge bg="danger" style={{color: "black"}}>Lost</Badge>
                                </ListGroup.Item>
                            </ListGroup>
                            <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                                {expiredSince ? expiredSince :
                                    <Placeholder animation="glow">
                                        <Placeholder xs={6}/>
                                    </Placeholder>
                                }
                            </Card.Footer>
                            </>
                        }
                        { status == null &&
                            (!expired ?
                                <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                                    Expiry: {timeToExpiry ? timeToExpiry :
                                        <Placeholder animation="glow">
                                            <Placeholder xs={6}/>
                                        </Placeholder>
                                    }
                                </Card.Footer> :
                                <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                                    Sold {expiredSince}
                                </Card.Footer>
                            )
                        }
                    </>:
                    <>
                        <Card.Body className="py-1 px-2 p-sm-2 px-sm-3">
                            Create a new Auction <br></br>
                            (From 🛁Aquarium)
                        </Card.Body>
                        <ListGroup className="list-group-flush">

                        </ListGroup>
                        <Card.Footer className="py-1 px-2 p-sm-2 px-sm-3">
                            <Placeholder as={Card.Text} animation="glow"><Placeholder xs={8}/></Placeholder>
                        </Card.Footer>
                    </>
                }
            </Card>
        </CardGroup>
    )
}

export default AuctionCard;
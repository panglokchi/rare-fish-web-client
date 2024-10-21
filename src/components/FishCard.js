import { Card, Badge, Placeholder } from 'react-bootstrap';

function FishCard({item, style = null, onClick = null, id = "", placeholder = false, icon = null, aquarium = false}) {
    return (
        <>
            <Card
                style={{...style, minWidth: "160px"}}
                onClick={onClick}
                id={id}
            >
                <Card.Header className="text-center p-1 p-sm-2">
                    <h1 className="display-1 d-block d-sm-none m-0" style={{fontSize: "4rem"}}>
                        {icon ? String.fromCodePoint("0x" + icon.slice(2)) : ( placeholder ? "❔" : String.fromCodePoint("0x" + item?.icon.slice(-5)))}
                    </h1>
                    {placeholder ? 
                        <div className="d-none d-sm-flex">
                            <div className="flex-fill">
                                <h1 className="display-1 d-none d-sm-block">
                                    {icon ? String.fromCodePoint("0x" + icon.slice(2)) : ( placeholder ? "❔" : String.fromCodePoint("0x" + item?.icon.slice(-5)))}
                                </h1>
                            </div>
                            
                            <div className="d-none d-sm-flex flex-column justify-content-between align-items-end">
                                <Placeholder animation="glow"><Placeholder xs={4}></Placeholder></Placeholder>
                                <div className="d-none d-sm-flex flex-column align-items-end">
                                    <Placeholder animation="glow"><Placeholder xs={4}></Placeholder></Placeholder>
                                </div>
                                
                            </div>
                        </div>
                        :
                        <div className="d-none d-sm-flex">
                            <div className="flex-fill">
                                <h1 className="display-1 d-none d-sm-block">
                                    {icon ? String.fromCodePoint("0x" + icon.slice(2)) : ( placeholder ? "❔" : String.fromCodePoint("0x" + item?.icon.slice(-5)))}
                                </h1>
                            </div>
                            
                            <div className="d-none d-sm-flex flex-column justify-content-between align-items-end">
                                <div>Lvl. {item?.level}</div>
                                <div className="d-none d-sm-flex flex-column align-items-end">
                                    <div>{"⭐".repeat(Math.min(Math.max(0,item?.stars-5),2))}</div>
                                    <div>{"⭐".repeat(Math.min(Math.max(0,item?.stars-3),2))}</div>
                                    <div>{"⭐".repeat(Math.min(Math.max(0,item?.stars),3))}</div>
                                </div>
                                
                            </div>
                        </div>
                    }
                </Card.Header>
                <Card.Body className="p-2 p-sm-3">
                    {placeholder ? 
                        <>
                            <Placeholder animation="glow"><Placeholder xs={4} /></Placeholder>
                        </> : 
                        <>
                            <div className="d-flex d-sm-none justify-contents-between mb-0"
                                style={{fontSize: "0.9rem"}}
                            >
                                <div className="mb-0">
                                    {"⭐".repeat(item?.stars)}
                                </div>
                                <div className="ms-auto mb-0">
                                    Lvl. {item?.level}
                                </div>
                            </div>
                            <div className="d-none d-sm-flex justify-contents-between mb-0 d-sm-none">
                                <div className="mb-0">
                                    {"⭐".repeat(item?.stars)}
                                </div>
                                <div className="ms-auto mb-0">
                                    Lvl. {item?.level}
                                </div>
                            </div>
                        </>
                    }
                    {placeholder ?
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={5}/> <Placeholder xs={4}/> 
                        </Placeholder> : 
                        <>
                            <Card.Title className="d-flex d-sm-none mb-1" style={{fontSize: "0.9rem"}}>
                                {item?.name}
                            </Card.Title>
                            <Card.Title className="d-none d-sm-flex" style={{fontSize: ""}}>
                                {item?.name}
                            </Card.Title>
                        </>
                        
                    }
                    {placeholder ?
                        <Placeholder as={Card.Subtitle} animation="glow">
                            <Placeholder xs={4} /> <Placeholder xs={3} />
                        </Placeholder> :
                        <>
                            <Card.Subtitle className="d-flex d-sm-none mb-2 text-muted" style={{fontSize: "0.8rem"}}>
                                {item?.fishType.genus} {item?.fishType.species}
                            </Card.Subtitle>
                            <Card.Subtitle className="d-none d-sm-flex mb-2 text-muted">
                                {item?.fishType.genus} {item?.fishType.species}
                            </Card.Subtitle>
                        </>
                        
                    }
                    {placeholder ?
                        <Placeholder as={Card.Text} animation="glow" className="mb-0">
                            <Placeholder xs={2} /> <Placeholder xs={2} />
                        </Placeholder> :
                        <>
                            <Card.Text className="d-flex d-sm-none mb-2"  style={{fontSize: "0.9rem"}}>
                                <Badge bg={
                                item?.rarity == "common" ? "success" :
                                item?.rarity == "rare" ? "primary" :
                                item?.rarity == "epic" ? "danger" :
                                item?.rarity == "legendary" ? "warning" :
                                "secondary"
                                } 
                                style={item?.rarity == "legendary" ? {color: "black"} : null}                                
                                className="me-2 p-1">{item?.rarity}</Badge>
                                <Badge bg={
                                item?.color == "white" ? "secondary" :
                                item?.color == "red" ? "danger" :
                                item?.color == "blue" ? "info" :
                                item?.color == "green" ? "success" :
                                "secondary"
                                }
                                style={item?.color == "blue" ? {color: "black"} : null} 
                                className="me-2 p-1">{item?.color}</Badge>
                            </Card.Text>
                            <Card.Text className="d-none d-sm-flex">
                                <Badge bg={
                                item?.rarity == "common" ? "success" :
                                item?.rarity == "rare" ? "primary" :
                                item?.rarity == "epic" ? "danger" :
                                item?.rarity == "legendary" ? "warning" :
                                "secondary"
                                }
                                style={item?.rarity == "legendary" ? {color: "black"} : null}   
                                className="me-2">{item?.rarity}</Badge>
                                <Badge bg={
                                item?.color == "white" ? "secondary" :
                                item?.color == "red" ? "danger" :
                                item?.color == "blue" ? "info" :
                                item?.color == "green" ? "success" :
                                "secondary"
                                }
                                style={item?.color == "blue" ? {color: "black"} : null}
                                className="me-2">{item?.color}</Badge>
                            </Card.Text>
                        </>
                        
                    }
                    {placeholder ?
                        <Placeholder as={Card.Text} animation="glow" className="mt-4">
                            <Placeholder xs={4} className=""/> <Placeholder xs={4} />
                        </Placeholder> :
                        <>
                            <Card.Text className="align-self-end d-flex d-sm-none mb-0" style={{fontSize: "0.9em"}} >
                                {item?.length > 100 ? (item?.length/100).toFixed(2) + " m" : item?.length.toFixed(2) + " cm"} {item?.weight > 1000 ? (item?.weight/1000).toFixed(2) + " kg" : (item?.weight).toFixed(2) + " g"}
                            </Card.Text>
                            <Card.Text className="align-self-end d-none d-sm-flex">
                                {item?.length > 100 ? (item?.length/100).toFixed(2) + " m" : item?.length.toFixed(2) + " cm"} {item?.weight > 1000 ? (item?.weight/1000).toFixed(2) + " kg" : (item?.weight).toFixed(2) + " g"}
                        </Card.Text> 
                        </>
                                 
                    }     
                </Card.Body>
                {aquarium == true && (placeholder ?
                    <Card.Footer className="d-flex justify-content-center">
                        <Placeholder as={Card.Text} animation="glow" className="mt-4">
                            <Placeholder xs={4} className=""/> <Placeholder xs={4} />
                        </Placeholder>
                    </Card.Footer> :
                    <>
                        <Card.Footer className="d-flex d-sm-none justify-content-center p-1"
                            style={{fontSize: "0.9rem", textAlign: "center"}}
                        >
                            🎉 {item?.popularity > 1000 ? item?.popularity/1000 + "k" : item?.popularity
                            } (💰{item?.popularity/20}/hr)
                        </Card.Footer>
                        <Card.Footer className="d-none d-sm-flex justify-content-center">
                            🎉 {item?.popularity > 1000 ? item?.popularity/1000 + "k" : item?.popularity
                            } (💰{item?.popularity/20}/hr)
                        </Card.Footer>
                    </>
                )}     
            </Card>
        </>
    )
}

export default FishCard;
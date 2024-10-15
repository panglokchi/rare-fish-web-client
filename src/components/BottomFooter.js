import {Navbar, Container, Nav, Offcanvas, NavDropdown, Stack, ProgressBar} from 'react-bootstrap';

function BottomFooter({playerData, expNeeded, fixed = "bottom", className}) {
  return (
    <Navbar fixed={fixed} key={false} expand="xl" className={"bg-body-tertiary mt-auto "+className}>
      <Container>
        <Stack gap={1}>
          <div className="d-flex justify-content-between p-0 mb-0">
            <p className='p-0 m-0'>Level {playerData.level}</p>
            <div className="">
              <p className='p-0 m-0 d-inline'>🌿 {playerData.kelp}</p>
              <p className='p-0 m-0 d-inline ms-2'>🦐 {playerData.bait}</p>
            </div>
            <p className='p-0 m-0'>💰{playerData.money.toFixed(2)}</p>
          </div>
          <ProgressBar>
            <ProgressBar now={parseInt(100*(playerData.exp - expNeeded.lastLevelExp)/(expNeeded.nextLevelExp - expNeeded.lastLevelExp))} />
          </ProgressBar>
          <Stack direction="horizontal">
            <p className='m-0'>Current XP {playerData.exp - expNeeded.lastLevelExp}</p>
            <p className="ms-auto m-0">{expNeeded.nextLevelExp - playerData.exp} to next level</p>
          </Stack>
        </Stack>
      </Container>
    </Navbar>
  )
}

export default BottomFooter;


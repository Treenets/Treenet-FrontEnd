import { MDBAnimation, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";

const IntroSection = () => {
    return (
        <MDBContainer
            style={{ height:"100vh", width: '100vw', paddingTop: '5em', }}
        >
            <header>
                <div className="view">
                    <MDBRow>
                        <MDBCol className='text-center text-md-left mt-xl-5 mb-5'>
                            <MDBAnimation type='fadeInRight' delay='.3s'>
                                <img className="rounded" src="./assets/image/treenet_square.png" height="450px"/>
                            </MDBAnimation>
                        </MDBCol>

                        <MDBCol className='text-center'>
                            <MDBAnimation type='fadeInLeft' delay='.3s'>
                                <h1 style={{color: "#978356", paddingTop:"4em"}} className='h1-responsive font-weight-bold mt-sm-5'>
                                A platform that allows everyday individuals to grow trees and earn through carbon tokens.
                                </h1>
                            </MDBAnimation>
                        </MDBCol>
                    </MDBRow>
                </div>
            </header>
        </MDBContainer>
    )
}

export default IntroSection
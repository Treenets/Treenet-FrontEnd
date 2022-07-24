import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon, MDBRow, MDBCol,
    MDBCard, MDBCardBody, MDBCardGroup,  MDBCardHeader, MDBCardText, MDBCardTitle, MDBCardVideo,
    MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink,
    MDBMedia, MDBFormInline, MDBInput, MDBMask,
} from "mdbreact";
import { 
    useMoralis, useMoralisWeb3Api, useNFTBalances,
} from "react-moralis";
import Avatar from 'react-avatar';
import LoadingSpinner from "./LoadingSpinner";
import { useValidateImageURL } from "use-validate-image-url";


const Wallet = (props) => {
    const {nfts} = props;
    const [toggle, setToggle] = useState('1');
    const [selectedNft, setSelectedNft] = useState({name:"No NFT selected"});
    const [user, setUser] = useState({});
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startChat, setStartChat] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [messageRequests, setMessageRequests] = useState(null);
    const [trees, setTrees] = useState(null);
    const [myTrees, setMyTrees] = useState(null);
    const [acceptedRequest, setAcceptedRequest] = useState(null);
    const [tokenId, setTokenId] = useState("");
    const [address, setAddress] = useState("0x2b2b623d5b40e8d5d0932abf4bb383b2b42f69c5");
    const { isInitialized, Moralis, authenticate, isAuthenticated, enableWeb3 } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const initialState = [];
    const chain = "ethereum";
    const options = {
        chain: "ethereum"
    };
    let nftCards = [];
    let userInfo = {};
    
    useEffect(async () => {
        const userString = localStorage.getItem('user');
        const userObject = JSON.parse(userString);
        const userInfo = userObject;
        // alert(JSON.stringify(userInfo));
        const wallet = userObject.wallet_address;
        setUser(userObject);
        if (wallet) {
            await getTrees();
            // await getMyTrees(wallet);
            setAddress(wallet);
            console.log(wallet, "Wallet");
            console.log(address, "Address");
            getNFTBalances({ params: { chain: "0x1", address: wallet } });
        }
    }, []);
    
    const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
 
    const removeDuplicates = (arr) => {
        return [...new Set(arr)];
    }

    const shortenString = (str, maxLength) => {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + "...";
        }
        return str;
    }

    const getTrees = async () => {
        axios
        .get(
            process.env.NEXT_PUBLIC_TREE_SERVICE
            + '?api_key=' + process.env.NEXT_PUBLIC_TREE_SERVICE_API_KEY
            + '&token=sdfsfrfsvefwecewfewfefewfefewfefe'
        )
        .then(result => {
            if (result.data && result.data.responseData !== null) {
                setTrees(result.data.responseData);
                // alert(JSON.stringify(result.data.responseData));
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const getMyTrees = async (wallet) => {
        axios
        .get(
            process.env.NEXT_PUBLIC_TREE_SERVICE
            + '?api_key=' + process.env.NEXT_PUBLIC_TREE_SERVICE_API_KEY
            + '&token=sdfsfrfsvefwecewfewfefewfefewfefe'
            + '&creator=' + wallet
        )
        .then(result => {
            if (result.data && result.data.responseData !== null) {
                setMyTrees(result.data.responseData);
                alert(JSON.stringify(result.data.responseData));
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const createMessageRequest = () => {
        setLoading(!loading);
        axios.put(
            process.env.NEXT_PUBLIC_FLECS_CHAT_SERVICE, 
            {
                creator_id: user.username,
                collection_id: selectedNft.name,
                token_id: tokenId,
                message: message
            },
            {
                params: {
                    api_key: process.env.NEXT_PUBLIC_FLECS_CHAT_SERVICE_API_KEY,
                    token: process.env.NEXT_PUBLIC_FLECS_CHAT_SERVICE_TOKEN,
                }
            }
        )
        .then(result => {
            console.log(result);
            setLoading(!loading);
            setErrorMessage("Message Request Sent.");
        })
        .catch(error => {
            setLoading(!loading);
            setErrorMessage("Message Request Failed");
            console.log(error);
        });
    }

    const displayNFTs= (NFTData) => {
        localStorage.setItem('NFTs', JSON.stringify(NFTData.result));
        // let newFilteredNFTs = removeDuplicates(NFTData.result);
        // alert(JSON.stringify(newFilteredNFTs));
        // alert(JSON.stringify(NFTData.result));

        let cardGrp = [];
        nftCards = (search !== "") ? NFTData.result.filter(nft => nft.name.toLowerCase().includes(search)): NFTData.result;
        
        return (
            <MDBContainer 
                className="text-white scrollbar scrollbar-juicy-peach"
                style = {{    
                    overflow:"auto",
                    minHeight: "100vh"
                }}
            >
                {
                    nftCards.length !== 0 ? (
                        nftCards
                        .map((element, i) => {
                            (cardGrp === 4) ? cardGrp.length = 0: null;
                            cardGrp.push(element);
                            return (
                                (cardGrp.length % 4 === 0)
                                ? CardRow([cardGrp[i - 3], cardGrp[i - 2], cardGrp[i - 1], cardGrp[i - 0]])
                                : (nftCards.length - 1 === i && cardGrp.length !== 0) ? CardRow(cardGrp) : null
                            );
                        })
                    ) 
                    : 
                    (
                        <h5>No NFTs</h5>
                    )
                }
            </MDBContainer>
        );
    };

    const TokenCardRow = (cardGrp) => {
        return (
            <MDBRow className='d-flex justify-content-center align-items-center'>
                {
                    cardGrp.map((element, i) => {
                        return (
                            <div key={i} style={{padding:"12px"}}>
                                {TokenCard(element)}
                            </div>
                        );
                    })
                }
            </MDBRow>
        );
    }

    const CardRow = (cardGrp) => {
        return (
            <MDBRow className='d-flex justify-content-center align-items-center'>
                {
                    cardGrp.map((element, i) => {
                        return (
                            <div key={i} style={{padding:"12px"}}>
                                {Card(element)}
                            </div>
                        );
                    })
                }
            </MDBRow>
        );
    }

    const TokenCard = (nft) => {
        return (
            <MDBCard onClick={()=>{openNft(nft)}} style={{maxHeight:"350px", maxWidth:"350px", backgroundColor: "transparent", marginBottom: "50px" }}>
                <CardImg src={nft.image_url} alt="Card image cap" name={nft.name} />
                <MDBCardHeader tag='h5' style={{height:"50px", borderRadius: "0.8rem", backgroundColor:"black"}}>
                    {nft.name}
                </MDBCardHeader>
            </MDBCard>  
        );
    }

    const Card = (nft) => {
        return (
            <MDBCard onClick={()=>{openNft(nft)}} style={{maxHeight:"350px", maxWidth:"350px", backgroundColor: "transparent", marginBottom: "50px" }}>
                <CardImg src={nft.image} alt="Card image cap" name={nft.name} />
                <MDBCardHeader tag='h5' style={{height:"50px", borderRadius: "0.8rem", backgroundColor:"black"}}>
                    {nft.name}
                </MDBCardHeader>
            </MDBCard>  
        )
    }

    function CheckImages(url) {
        const status = useValidateImageURL(url);
        let valid = (status === 'invalid' || status === 'progress') ? false : true
        return valid;
    }

    const openNft = (nftInfo) => {
        setSelectedNft(nftInfo);
        setModal1(!modal1);
    }

    const acceptRequest = () => {
        setAcceptedRequest(true);
        setModal2(!modal2);
    }

    const ignoreRequest = () => {
        setAcceptedRequest(false);
        setModal2(!modal2);
    }

    const DisplayCardImg = (props) => {
        const { src, alt, name } = props;
        const gradients = [
            "tempting-azure-gradient", 
            "blue-gradient", 
            "purple-gradient", 
            "winter-neva-gradient", 
            "warm-flame-gradient", 
            "night-fade-gradient", 
            "dusty-grass-gradient", 
            "peach-gradient", 
            "young-passion-gradient"
        ];
        const min = 0;
        const max = 8;
        const rand = min + Math.random() * (max - min);
        const gradient = gradients[Math.floor(rand)];
        
        return (
            CheckImages(src)
            ?
                <img
                    object
                    src={src}
                    onError={() => {isValid = false}}
                    alt='Generic placeholder image'
                    height="450px"
                    style={{ borderRadius: "0.5rem", maxHeight:"451px", maxWidth:"451px", minHeight:"450px", minWidth:"450px" }}
                />
            :
                <div
                    style={{height:"450px", width:"450px", borderRadius: "0.5rem"}}
                    className={gradient}
                >
                    <MDBMask className="d-flex justify-content-center align-items-center">
                        {name}
                    </MDBMask>
                </div>
        );
    }

    const DisplayNftImg = (props) => {
        const { src, alt, name } = props;
        const gradients = [
            "tempting-azure-gradient", 
            "blue-gradient", 
            "purple-gradient", 
            "winter-neva-gradient", 
            "warm-flame-gradient", 
            "night-fade-gradient", 
            "dusty-grass-gradient", 
            "peach-gradient", 
            "young-passion-gradient"
        ];
        const min = 0;
        const max = 8;
        const rand = min + Math.random() * (max - min);
        const gradient = gradients[Math.floor(rand)];
        
        return (
            CheckImages(src)
            ?
                <img
                    object
                    src={src}
                    onError={() => {isValid = false}}
                    alt='Generic placeholder image'
                    // height="250px"
                    // style={{ borderRadius: "0.5rem", maxHeight:"251px", maxWidth:"251px", minHeight:"250px", minWidth:"250px" }}
                />
            :
                <div
                    // style={{height:"250px", width:"250px", borderRadius: "0.5rem"}}
                    className={gradient}
                >
                    <MDBMask className="d-flex justify-content-center align-items-center">
                        {name}
                    </MDBMask>
                </div>
        );
    }

    const CardImg = (props) => {
        const { src, alt, name } = props;
        const gradients = [
            "tempting-azure-gradient", 
            "blue-gradient", 
            "purple-gradient", 
            "winter-neva-gradient", 
            "warm-flame-gradient", 
            "night-fade-gradient", 
            "dusty-grass-gradient", 
            "peach-gradient", 
            "young-passion-gradient"
        ];
        const min = 0;
        const max = 8;
        const rand = min + Math.random() * (max - min);
        const gradient = gradients[Math.floor(rand)];
        
        return (
            CheckImages(src)
            ?
                <img
                    object
                    src={src}
                    onError={() => {isValid = false}}
                    alt='Generic placeholder image'
                    height="250px"
                    style={{ borderRadius: "0.5rem", maxHeight:"251px", maxWidth:"251px", minHeight:"250px", minWidth:"250px" }}
                />
            :
                <div
                    style={{height:"250px", width:"250px", borderRadius: "0.5rem"}}
                    className={gradient}
                >
                    <MDBMask className="d-flex justify-content-center align-items-center">
                        {name}
                    </MDBMask>
                </div>
        );
    }
    
    const handleSearch = (searchParam) => {
        if (toggle !== '5') {
            setToggle('5');   
        }
        const userInput = searchParam.currentTarget.value.toLowerCase();
        if (userInput !== "" && userInput !== " ") {
            setSearch(userInput);
            console.log("Search Param: ", search);
        } else {
            setSearch("");
            console.log("Search Param: ", search);
        }
    }

    const comingSoon = () => {
        return(
            <div className="text-black" noBorder={true}>
                <MDBRow>
                    <MDBCol sm='12'>
                        <div className="d-flex justify-content-center align-items-center">
                            {/* <img src={comingSoon} alt="Coming Soon" style={{height:"250px", width:"250px"}}/> */}
                            <h1>Coming Soon</h1>
                        </div>
                    </MDBCol>
                </MDBRow>
            </div>
        )
    }

    const verifyWallet = () => {
        return(
            <LoadingSpinner/>
        )
    }

    // Display all trees return as an array of objects
    const DisplayTrees = (treeData) => {
        let cardGrp = [];
        
        return (
            <MDBContainer 
                className="text-white scrollbar scrollbar-juicy-peach"
                style = {{    
                    overflow:"auto",
                    minHeight: "100vh"
                }}
            >
                {
                    treeData.length !== 0 ? (
                        treeData
                        .map((tree, i) => {
                            (cardGrp === 4) ? cardGrp.length = 0: null;
                            cardGrp.push(tree);
                            return (
                                (cardGrp.length % 4 === 0)
                                ? TokenCardRow([cardGrp[i - 3], cardGrp[i - 2], cardGrp[i - 1], cardGrp[i - 0]])
                                : (trees.length - 1 === i && cardGrp.length !== 0) ? TokenCardRow(cardGrp) : null
                            );
                        })
                    ) 
                    : 
                    (
                        <h5>No Trees to display</h5>
                    )
                }
            </MDBContainer>
        );
    }

    // Display all trees return as an array of objects
    const DisplayMyTrees = (treeData) => {
        let cardGrp = [];
        
        return (
            <MDBContainer 
                className="text-white scrollbar scrollbar-juicy-peach"
                style = {{    
                    overflow:"auto",
                    minHeight: "100vh"
                }}
            >
                {
                    treeData.length !== 0 ? (
                        treeData
                        .map((tree, i) => {
                            (cardGrp === 4) ? cardGrp.length = 0: null;
                            cardGrp.push(tree);
                            return (
                                (cardGrp.length % 4 === 0)
                                ? CardRow([cardGrp[i - 3], cardGrp[i - 2], cardGrp[i - 1], cardGrp[i - 0]])
                                : (trees.length - 1 === i && cardGrp.length !== 0) ? CardRow(cardGrp) : null
                            );
                        })
                    ) 
                    : 
                    (
                        <h5>No Trees to display</h5>
                    )
                }
            </MDBContainer>
        );
    }

    const showWallet = () => {
        let chatWindow = false; 
        return(
            <MDBContainer className="text-black">
                <div className="text-white" noBorder={true}>
                    <h1 className="black-text"><b>Explore</b></h1>
                    <p className="black-text">View all of the Trees on <b style={{color:"#978356"}}>Treenet</b></p>
                </div>
                <MDBRow>
                    <MDBCol sm='2' style={{height: "20px"}}>
                        <a style={{color: (toggle=='1')? "black" : "#978356"}}>
                            <p onClick={()=>{setToggle('1')}}><MDBIcon fas icon="tree"/> All Trees NFTs</p>
                        </a>
                    </MDBCol>
                    <MDBCol sm='2' style={{height: "20px"}}>
                        <a style={{color: (toggle=='2')? "black" : "#978356"}}>
                            <p onClick={()=>{setToggle('2')}}><MDBIcon fas icon="tree"/> Your Tree NFTs</p>
                        </a>
                    </MDBCol>
                    <MDBCol sm='2' style={{height: "20px"}}>
                        <a style={{color: (toggle=='3')? "black" : "#978356"}}>
                            <p onClick={()=>{setToggle('3')}}><MDBIcon fas icon="credit-card"/> Your Payments</p>
                        </a>
                    </MDBCol>
                    <MDBCol sm='2' style={{height: "20px"}}>
                        <a style={{color: (toggle=='4')? "black" : "#978356"}}>
                            <p onClick={()=>{setToggle('4')}}><MDBIcon fas icon="ticket-alt"/> Rewards</p>
                        </a>
                    </MDBCol>
                    <MDBCol sm='2' style={{height: "20px"}}>
                        <a style={{color: (toggle=='5')? "black" : "#978356"}}>
                            <p onClick={()=>{setToggle('5')}}><MDBIcon fas icon="wallet" /> Your Wallet</p>
                        </a>
                    </MDBCol>
                    <MDBCol sm='2' style={{height: "20px", paddingBottom: "20px"}}>
                        <input className="form-control" onChange={searchEvent => handleSearch(searchEvent)} value={search} style={{maxHeight: "30px", color:"#ffffff !important", backgroundColor:"transparent", border: 0, paddingBottom: "12px", outline: "none !important"}} type="text" placeholder="Search NFTs" aria-label="Search" />
                    </MDBCol>
                </MDBRow>
                <hr style={{paddingTop:"0px"}} className='hr-light'/>
                <MDBTabContent activeItem={toggle}>
                    <MDBTabPane tabId='1' role='tabpanel'>
                        {
                            trees !== null && trees.length > 0
                            ?
                                DisplayTrees(trees)
                            :
                                <div className="d-flex justify-content-center align-items-center" style={{height:"80vh"}}>
                                    <LoadingSpinner/>
                                </div>
                        }
                    </MDBTabPane>
                    <MDBTabPane tabId='2' role='tabpanel'>
                        {
                            trees !== null && trees.length > 0
                            ?
                                // DisplayMyTrees(myTrees)
                                DisplayTrees(trees)
                            :
                                <div className="d-flex justify-content-center align-items-center" style={{height:"80vh"}}>
                                    <LoadingSpinner/>
                                </div>
                        }
                    </MDBTabPane>
                    <MDBTabPane tabId='3' role='tabpanel'>
                        {comingSoon()}
                    </MDBTabPane>
                    <MDBTabPane tabId='4' role='tabpanel'>
                        {comingSoon()}
                    </MDBTabPane>
                    <MDBTabPane tabId='5' role='tabpanel'>
                        {
                            data !== null
                            ?   
                                displayNFTs(data)
                            :
                                <div className="d-flex justify-content-center align-items-center" style={{height:"80vh"}}>
                                    {/* {()=>{getNFTBalances({ params: { chain: "0x1", address: address } }); console.log("Getting NFTs")}} */}
                                    <LoadingSpinner/>
                                </div>
                        }
                    </MDBTabPane>
                </MDBTabContent>

                <MDBModal isOpen={modal1} toggle={() => { setModal1(!modal1) }}  position="top-right">
                    <MDBModalBody toggle={() => {setModal1(!modal1)}}  className="form"
                        style={{
                            // height: "150px !important",
                            maxWidth: "450px !important",
                            overflow: "hidden",
                            backgroundImage: "url(./bg.svg)",
                            backgroundSize: "cover",
                            backgroundColor: "#111111"
                        }}
                    >
                        {
                            startChat
                            ?
                                <MDBContainer className="justify-content-center align-items-center" >
                                    <form className="signInForm">
                                        <h1 className="text-white text-center"><b>Request Chat</b></h1>
                                        <h2 style={{fontSize:"1em", width:"100%"}}>
                                            Start a chat with the owner of an NFT in the {selectedNft.name} collection
                                        </h2>
                                        <label htmlFor="" className="grey-text">
                                            Message
                                        </label>
                                        <textarea 
                                            className="form-control" 
                                            type="text" 
                                            id="message" 
                                            required 
                                            onChange={(event) => {setMessage(event.target.value)}}
                                            style={{
                                                backgroundColor: "transparent",
                                                borderWidth:"2px", 
                                            }}
                                        />
                                        
                                        <label htmlFor="" className="grey-text">
                                            Token ID or NFT Name
                                        </label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="tokenIdInput"
                                            required 
                                            onChange={(event) => {setTokenId(event.target.value)}}
                                            style={{
                                                backgroundColor: "transparent",
                                                borderWidth:"2px", 
                                            }}
                                        />
                                        <br/>
                                        <button 
                                            type="button"
                                            className="btn rounded" 
                                            style={{
                                                backgroundColor: "#00ffa1", width:"100%", margin:"0px", color: "black"
                                            }}
                                            onClick={() => {createMessageRequest()}}
                                        >
                                            <b>Create Chat</b>
                                        </button>
                                        <br/>
                                        <p style={{color:"#00ffa1"}}>{errorMessage}</p>
                                    </form>
                                    <br/>

                                    <button
                                        className="btn rounded"
                                        style={{
                                            backgroundColor:"#111111", color:"#00ffa1", fontSize:"1.3em", width:"100%"
                                        }}
                                        onClick={() => {setStartChat(!startChat)}}
                                    >
                                        <MDBIcon icon="plus-square"/> <b> Create Event </b>
                                    </button>
                                </MDBContainer>
                            :
                                <MDBContainer className="justify-content-center align-items-center" >
                                    <p>{selectedNft.name}</p>
                                    <div className="d-flex justify-content-center align-items-center">
                                        {/* <DisplayNftImg src={selectedNft.image} alt="Card image cap" name={selectedNft.name} /> */}
                                        <Avatar src={selectedNft.image} alt="NFT Image" name={selectedNft.name} size="100%"/>
                                    </div>
                                    <br/>
                                    <a
                                        className="btn rounded"
                                        style={{
                                            backgroundColor:"#111111", color:"#00ffa1", fontSize:"1.3em", width:"100%"
                                        }}
                                        href={"./create/" + selectedNft.token_address}
                                    >
                                        <MDBIcon icon="plus-square"/> <b> Create Event </b>
                                    </a>

                                    <button
                                        className="btn rounded text-black"
                                        style={{
                                            backgroundColor:"#111111", color:"#00ffa1", fontSize:"1.3em", width:"100%"
                                        }}
                                        onClick={() => {setStartChat(!startChat)}}
                                    >
                                        <MDBIcon far icon="comments" /> <b> Create Chat </b>
                                    </button>
                                </MDBContainer>
                        }
                    </MDBModalBody>
                </MDBModal>
                <MDBModal isOpen={modal2} toggle={() => { setModal2(!modal2) }}  position="top-right">
                    <MDBModalBody toggle={() => {setModal2(!modal2)}}  className="form"
                        style={{
                            // height: "150px !important",
                            maxWidth: "450px !important",
                            overflow: "hidden",
                            backgroundImage: "url(./bg.svg)",
                            backgroundSize: "cover",
                            backgroundColor: "#111111"
                        }}
                    >
                        <MDBModalHeader style={{color:"#00ffa1"}}>Message Request</MDBModalHeader>
                        <p style={{paddingLeft:"10px", paddingRight:"10px"}}>
                            <h3><b>A user has sent you a message request!</b></h3>
                        </p>
                        <MDBRow>
                            <MDBCol>
                                <button
                                    className="btn rounded text-black"
                                    style={{
                                        backgroundColor:"#111111", color:"#00ffa1", fontSize:"0.9em", width:"100%"
                                    }}
                                    onClick={() => {acceptRequest()}}
                                >
                                    <MDBIcon far icon="comments" /> <b> Accept Request </b>
                                </button> 

                            </MDBCol>
                            <MDBCol>
                                <button
                                    className="btn rounded text-black"
                                    style={{
                                        backgroundColor:"#111111", color:"#00ffa1", fontSize:"0.9em", width:"100%"
                                    }}
                                    onClick={() => {ignoreRequest()}}
                                >
                                    <MDBIcon far icon="comments" /> <b> Ignore Request </b>
                                </button>
                            </MDBCol>
                        </MDBRow>    
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer>
        )
    }

    return (
        (user.wallet_address === null || user.wallet_address === undefined)
            ? verifyWallet() 
            : showWallet()
    )
}

export default Wallet;
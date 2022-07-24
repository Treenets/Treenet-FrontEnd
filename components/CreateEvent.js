import { useState } from "react";
import Router from 'next/router';
import axios from 'axios';
import { MDBContainer, MDBIcon, MDBRow, MDBCol, MDBModal, MDBModalBody } from "mdbreact";
import { 
    useMoralis, useMoralisFile, useMoralisWeb3ApiCall, useMoralisWeb3Api, useWeb3ExecuteFunction 
} from "react-moralis";
import { abi } from "../contracts/caste_abi.json";
import LoadingSpinner from "./LoadingSpinner";
import bg from "../public/assets/image/bg.png";
import styles from '../styles/Create.module.css';
// import DatePicker from 'react-date-picker';
// import DtPicker from 'react-calendar-datetime-picker';
// import { DateTime } from 'react-datetime-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';

const CreateEvent = () => {
    const { authenticate, isAuthenticated, enableWeb3, user, Moralis } = useMoralis();
    const Web3Api = useMoralisWeb3Api();

    const { fetch } = useWeb3ExecuteFunction();
    const { saveFile } = useMoralisFile();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [breed, setBreed] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");
    const [enlargedCard, setEnlargedCard] = useState("");
    const [modal, setModal] = useState(false);

    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [addQuestion, setAddQuestion] = useState(false);
    const [addNFT, setAddNFT] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [date, setDate] = useState(null)
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [time, setTime] = useState("");
    const [nft, setNft] = useState("");
    const [rangeValue, setRangeValue] = useState(50);
    const [imageUrl, setImageUrl] = useState("");
    const [imageHash, setImageHash] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [answersArray, setAnswersArray] = useState([]);
    const [questionsArray, setQuestionsArray] = useState([]);
    const [whitelistArray, setWhitelistArray] = useState([]);
    const Questions = [];
    const Answers = [];
    const Whitelist = [];
    
    const chain = "Mumbai";
    const nft_contract_address = "0x39fb37AA56d771cB720aF170250f67D1e1a77a68"; 

    let yesterday = moment().subtract( 1, 'day' );
    let today = moment().subtract( 0, 'day' );
    let now = moment().subtract( 0, 'hour' );
    let valid = function( current ){
        return current.isAfter( yesterday );
    };
    let inputProps = {
        placeholder: 'Date Time',
        style: {
            borderColor: '#978356 !important', 
            borderWidth:"2px",
            width: "400px"
        },
    };
        
    async function walletConnect() {
        await authenticate({signingMessage:"Lore Sign In"});
        enableWeb3();
        try{
            let addr = user.get('ethAddress');
        } catch(e) { 
            console.error(e);
        }
        window.location.reload();
    }
    
    const handleTimeChange = (v) => {
        console.log(String(v));
        if (v) {
            setDate(v);
            setStartDate(v);
            console.log(v);
        }
    }

    function handleFiles(files) {
        console.log("handleFiles");
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            uploadFile(files[i]);
        }
    }

    async function uploadFile(file) {
        setLoading(true);
        if (file && file.name) {
            let fileIpfs = await saveFile(file.name, file, { saveIPFS: true });
            console.log(fileIpfs);
            const _url = fileIpfs._url;
            const _name = fileIpfs._name;
            const _ipfs = fileIpfs._ipfs;
            const _hash = fileIpfs._hash;
            setImageHash(_hash);
            setImageUrl(_ipfs);
            alert(_ipfs);
            setLoading(false);
            console.log(imageHash);
            console.log(_ipfs);
        }

        // const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
        // const xhr = new XMLHttpRequest();
        // const fd = new FormData();
        // xhr.open("POST", url, true);
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // // Update progress (can be used to show progress indicator)
        // xhr.upload.addEventListener("progress", (e) => {
        //     setProgress(Math.round((e.loaded * 100.0) / e.total));
        //     setErrorMessage(Math.round((e.loaded * 100.0) / e.total));
        //     console.log(Math.round((e.loaded * 100.0) / e.total));
        // });

        // xhr.onreadystatechange = (e) => {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         const response = JSON.parse(xhr.responseText);
        //         setImageUrl(response.secure_url);
        //         console.log(response.secure_url);
        //     }
        // };

        // fd.append(
        //     "upload_preset",
        //     process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        // );
        // fd.append("tags", "browser_upload");
        // fd.append("file", file);
        // xhr.send(fd);
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();
        if (
            !e.target.eventName.value || !e.target.eventDesc.value || 
            !date || !rangeValue 
            // ||
            // Array.isArray(answersArray) || answersArray.length || Array.isArray(questionsArray) || questionsArray.length
        ){
            const error = 'Please check that all information has been entered correctly!';
            setErrorMessage(error);
        } else {

            if (!isAuthenticated && !user ) {
                walletConnect();
            }
            
            const unix_timestamp = date.unix();
            console.log(date.unix());
            setLoading(true);

            axios.put(
                process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE, 
                {
                    event_name: e.target.eventName.value,
                    event_creator: user.get('ethAddress'),
                    event_desc: e.target.eventDesc.value,
                    event_capacity: rangeValue,
                    event_wallet: user.get('ethAddress'),
                    event_video: imageUrl,
                    event_metadata: JSON.stringify(questionsArray),
                    event_response_metadata: JSON.stringify(answersArray),
                    event_start: unix_timestamp,
                    event_whitelist: JSON.stringify(whitelistArray)
                },
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_LORE_EVENTS_SERVICE_API_KEY,
                        token: "sdfsfrfsvefwecewfewfefewfefewfefe"
                    }
                }
            )
            .then(result => {
                console.log(result);
                setLoading(false);
                setErrorMessage(result.data.message);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        }
    }

    const mintToken = async (tokenURI) => {
        const options = {
            abi: abi,
            contractAddress: nft_contract_address,
            functionName: "safeMint",
            to: user.get('ethAddress'),
            uri: tokenURI,
            params: {
                to: user.get('ethAddress'),
                uri: tokenURI,
                tokenURI: tokenURI,
            },
        };

        console.log("Options: ", options);

        await fetch({
            params: options,
            onSuccess: (response) => {setInteractionData(response); console.log("MINT COMPLETE"); setLoading(false); setModal(!modal); setModal1(!modal1)},
            onComplete: () => {console.log("MINT COMPLETE"); setLoading(false); setModal(!modal)},
            onError: (error) => {console.log("ERROR", error); setLoading(false); setModal(!modal)},
        });
    };

    async function mint() {
        setLoading(true);
        if(!isAuthenticated){
            await walletConn();
        }
        enableWeb3();
    
        let metadata = {
            name: name,
            description: description,
            plant_date: startDate,
            breed: breed,
            location: location,
            // image: "/ipfs/" + imageHashString,
            image_url: imageUrl
        }

        setEnlargedCard(imageUrl);
    
        const jsonFile = await saveFile(
            "metadata.json", 
            {base64 : btoa(JSON.stringify(metadata))}, 
            { saveIPFS: true }
        );
    
        const metadataHash = jsonFile._hash;
    
        const tokenURI = 'ipfs://' + metadataHash;
        console.log("TokenURI: ", tokenURI);

        axios.put(
            process.env.NEXT_PUBLIC_TREE_SERVICE, 
            {
                name: name,
                description: description,
                creator: user.get('ethAddress'),
                breed: breed,
                location: location,
                image_url: imageUrl,
                start_date: startDate
            },
            {
                params: {
                    api_key: process.env.NEXT_PUBLIC_TREE_SERVICE_API_KEY,
                    token: "sdfsfrfsvefwecewfewfefewfefewfefe"
                }
            }
        )
        .then(result => {
            console.log(result);
            setLoading(false);
            setErrorMessage(result.data.message);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });

        mintToken(tokenURI);
    }

    const handleNameChange=(e) => {
        setName(e.target.value);
    } 
    
    const handleDescriptionChange = (e) => {
        if (e.target.value !== null) {
            setDescription(e.target.value);
        }
    }
        
    const handleBreedChange = (e) => {
        if (e.target.value !== null) {
            setBreed(e.target.value);
        }
    }
        
    const handleLocationChange = (e) => {
        if (e.target.value !== null) {
            setLocation(e.target.value);
        }
    }

    const handleDateChange = (e) => {
        if (e.target.value !== null) {
            setStartDate(e.target.value);
        }
    }
    
    return (
        <MDBContainer 
            style={{
                width: "100vw !important",
                height:"800px", position:"relative", margin: "auto",
                backgroundImage: "url("+ bg +")"
            }}
        >            
            <div 
                style={{
                    position: "absolute",
                    top:"50%", left:"50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                
                <form className="signUpForm" onSubmit={handleSubmit}
                    style = {{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                        <h2 style={{color:"#978356"}} className="text-center"><b>Create Tree Token</b></h2>
                        <input 
                            className="form-control"
                            id="treeName" 
                            type="text"
                            placeholder="Tree Name" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#978356", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            required
                            onChange={handleNameChange}
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="treeDesc" 
                            type="text"
                            placeholder="Tree Description" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#978356", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            onChange={handleDescriptionChange}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="treeBreed" 
                            type="text"
                            placeholder="Tree Breed" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#978356", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            onChange={handleBreedChange}
                            required
                        />
                        <br/>

                        <input 
                            className="form-control"
                            id="treeLocation" 
                            type="text"
                            placeholder="Tree Location" 
                            style={{
                                backgroundColor: "transparent",
                                borderColor: "#978356", 
                                borderWidth:"2px", 
                                width:"400px"
                            }}
                            onChange={handleLocationChange}
                            required
                        />
                        <br/>
   
                        <Datetime  
                            isValidDate={valid} 
                            input={true} 
                            inputProps={inputProps} 
                            onChange={handleTimeChange}
                            onClose={handleTimeChange}
                        />
                        <br/>

                        <div className="">
                            <div className="">
                                <input 
                                    className="" 
                                    onChange={(e) => handleFiles(e.target.files)}  
                                    style={{width:"400px"}}
                                    type="file" 
                                    name="Upload to IPFS" 
                                    id="chooseFile"  
                                />
                            </div>
                        </div>
                        <br/>
                        
                        {
                            loading
                            ?
                                <LoadingSpinner/>
                            :
                                <button 
                                    className="btn rounded text-white" 
                                    style={{
                                        backgroundColor: "#978356", width:"400px", margin:"0px"
                                    }}
                                    disabled={disabledSubmit}
                                    onClick={() => {mint()}}
                                >
                                    <b>Mint Tree NFT</b>
                                </button>
                        }
 
                        <br/>
                        <p style={{color:"#978356", maxWidth: "400px"}}>{errorMessage}</p>
                </form>
            </div>
    
            <MDBModal isOpen={modal} toggle={() => {setModal()}} side position="top-right">
                <MDBModalBody style={{backgroundColor: "#000"}} toggle={() => {setModal()}}  className="form">
                    <MDBContainer className="d-flex justify-content-center align-items-center">
                        <img className="rounded" src={enlargedCard} height="450px"/>
                    </MDBContainer>
                </MDBModalBody>
            </MDBModal>
        </MDBContainer>
    )
}

export default CreateEvent;
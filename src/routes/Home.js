import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { query, collection, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";

const Home =  ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    // const getNweets = async() =>{
    //     const q = query(collection(dbService,"nweets"));
    //     const querySnapshot = await getDocs(q);

    //     querySnapshot.forEach((doc)=>{
    //         const nweetObj = {
    //             ...doc.data(),
    //             id: doc.id,
    //         }
    //         setNweets(prev =>[nweetObj, ...prev]);
    //     });
    // };

    useEffect(() => {
        const q = query(collection(dbService,"nweets"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            // console.log("변화함");
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
                setNweets(nweetArr);
        });
    }, []);

    const moveToTop = () => (document.documentElement.scrollTop = 0);

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                    ))}
            </div>
            <div className="factoryInput__arrow upBtn" onClick={moveToTop}><span className="arrows"><FontAwesomeIcon icon={faLongArrowAltUp} /></span></div>
        </div>
    );
};
export default Home;
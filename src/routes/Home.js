import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { query, collection, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

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

    return (
        <div>
            <NweetFactory userObj={userObj} />
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                    ))}
            </div>
        </div>
    );
};
export default Home;
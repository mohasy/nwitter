import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { addDoc, query, collection, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";

const Home =  ({userObj}) => {
    const [nweet, setNweet] = useState("");
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

    const onSubmit = async(e) => {
        e.preventDefault();
        await addDoc(collection(dbService, "nweets"),{
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
    };

    const onChange = (event) => {
        const { target:{value} } = event;
        setNweet(value);
    };
    // console.log(nweets);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} type="text" on
                onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input type="submit"
                value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                    ))}
            </div>
        </div>
    );
};
export default Home;
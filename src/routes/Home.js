import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { addDoc, getDocs, query, collection } from "@firebase/firestore";

const Home =  () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    const getNweets = async() =>{
        const q = query(collection(dbService,"nweets"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc)=>{
            const nweetObj = {
                ...doc.data(),
                id: doc.id,
            }
            setNweets(prev =>[nweetObj, ...prev]);
        });
    };

    useEffect(() => {
        getNweets();
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        await addDoc(collection(dbService, "nweets"),{
            nweet,
            createdAt: Date.now(),
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
                    <div key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </div>
                    ))}
            </div>
        </div>
    );
};
export default Home;
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";

const Home =  () => {
    const [nweet, setNweet] = useState("");
    const onSubmit = async(e) => {
        e.preventDefault();
        await addDoc(collection(dbService, "nweets"),{
            nweet,
            createdAt: serverTimestamp(),
        });
        setNweet("");
    };
    const onChange = (event) => {
        const { target:{value} } = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} type="text" on
                onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input type="submit"
                value="Nweet" />
            </form>
        </div>
    );
};
export default Home;
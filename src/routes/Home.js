import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, query, collection, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import { ref, uploadString } from "firebase/storage";
import { v4 } from "uuid";

const Home =  ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [atttachment, setAttachment] = useState();

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
        const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(fileRef, atttachment, "data_url");
        console.log(response);
        // await addDoc(collection(dbService, "nweets"),{
        //     text: nweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid
        // });
        // setNweet("");
    };

    const onChange = (event) => {
        const { target:{value} } = event;
        setNweet(value);
    };
    // console.log(nweets);

    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {
            target: {files}
        } = event;
        //한개의 파일만 받음
        const theFile = files[0];
        // console.log(theFile);
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            // console.log(finishedEvent);
            const {
                currentTarget: {result}
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    }

    //파일 지우기
    const onClearAttachment = () => setAttachment(null);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} type="text" on
                onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit"
                value="Nweet" />
                {atttachment && 
                    <div>
                        <img src={atttachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>삭제</button>
                    </div>
                }
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
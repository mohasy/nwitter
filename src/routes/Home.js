import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, query, collection, onSnapshot, orderBy } from "@firebase/firestore";
import Nweet from "components/Nweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Home =  ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

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
        let attachmentUrl = "";
        //업로드한 파일이 있어야 실행
        if (attachment !== "") {
            //파일 경로 참조 만들기
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(attachmentRef, attachment, "data_url");
            // console.log(response);
            //storage에 있는 파일 URL로 다운로드 받기
            attachmentUrl = await getDownloadURL(response.ref);
            // console.log(attachmentUrl);
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        await addDoc(collection(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
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
                {attachment && 
                    <div>
                        <img src={attachment} width="50px" height="50px" />
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
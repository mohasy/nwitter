import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { addDoc, collection } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async(e) => {
        if (nweet === "") {
            return;
          }

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
            userName: userObj.displayName
        }
    
        if(nweetObj.userName == null)  nweetObj.userName= "User";
        
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
    const onClearAttachment = () => setAttachment("");
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
        <input id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }} />
        {attachment && 
             <div className="factoryForm__attachment">
             <img
               src={attachment}
               style={{
                 backgroundImage: attachment,
               }}
             />
             <div className="factoryForm__clear" onClick={onClearAttachment}>
               <span>Remove</span>
               <FontAwesomeIcon icon={faTimes} />
             </div>
            </div>
        }
    </form>
    )}

export default NweetFactory;
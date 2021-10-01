import { doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하겠습니까?");
        if(ok){
            // await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
            await deleteObject(ref(storageService, nweetObj.attachmentUrl));
        }
    }
    
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {
            text: newNweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewNweet(value);
    };

    return (
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit Your nweet" value={newNweet} required onChange={onChange} />
                    <input type="submit" value="Update Nweet" />
                </form>
                <button onClick={toggleEditing}>취소</button>
                </>
            ):(
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (<img src={nweetObj.attachmentUrl} width="50px" height="50px" />)}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>삭제</button>
                            <button onClick={toggleEditing}>수정</button>
                        </>
                    )}
                </>
            )}
        </div>
    )};   
    export default Nweet;
import { doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하겠습니까?");
        if(ok){
            // await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
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
import React, { useState } from 'react';
import { addDoc, collection } from "@firebase/firestore";
import { dbService } from "fbase";

const CommentFactory = ({userObj}) => {
    const [comment, setComment] = useState("");

    const onSubmit = async (event) => {
        if (comment === "") {
            return;
          }
        event.preventDefault();
        console.log("comment enter");

        const commentObj = {
            text: comment,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            userName: userObj.displayName
        }
        if(commentObj.userName == null)  commentObj.userName= "User";
        
        await addDoc(collection(dbService, "comments"), commentObj);
        setComment("");
    }

    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setComment(value);
        // console.log(comment);
    };

    return (
        <form className="comment" onSubmit={onSubmit}>
            <div className="factoryInput__container">
                <input type="text" placeholder="What's on your comment?" value={comment} required autoFocus onChange={onChange} className="formInput" maxLength={120}/>
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
        </form>
    )

}

export default CommentFactory;
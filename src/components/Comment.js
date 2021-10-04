import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function formatDate(curDate) {
	var today, resultDate, timegap;
	today = new Date();
	resultDate = new Date(curDate);
	timegap = (today - resultDate)/(60*60*1000);
	
	var curYear = resultDate.getFullYear();
	var curMonth = (resultDate.getMonth() + 1);
	var curDay = resultDate.getDate();

	// Time (minutes * seconds * millisecond)
	if (timegap <= 24) {
		if (Math.floor(timegap) == 0) {
			resultDate = Math.floor(timegap * 24) + ' 분 전';
		}
		else {
			resultDate = Math.floor(timegap) + ' 시간 전';
		}
	}
	else {
		resultDate = curYear + '-' + curMonth + '-' + curDay;
	}
	
	return resultDate;
};


const Comment = ({commentObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newComment, setNewComment] = useState(commentObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하겠습니까?");
        if(ok){
            await deleteDoc(doc(dbService, `comments/${commentObj.id}`));
        }
    }
    
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `comments/${commentObj.id}`), {
            text: newComment,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewComment(value);
    };

    return (
        <>
        <div className="comment">
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container commentEdit">
                    <input type="text" placeholder="Edit Your comment" value={newComment} required autoFocus onChange={onChange} className="formInput" />
                    <input type="submit" value="Update Comment" className="formBtn" />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
            ):(
                    <>
                    
                    <h className="userName">@ {commentObj.userName} <span className="nweetTime">{formatDate(commentObj.createdAt)}</span></h>
                        <h4>{commentObj.text}</h4>
                        
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                    </>
            )}
        </div>
        </>
    )};   
    export default Comment;
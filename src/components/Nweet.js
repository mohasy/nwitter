import { doc, deleteDoc, updateDoc } from "@firebase/firestore";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "./Modal";

// 시간 기능 추가 
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

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [showModal, setShowModal] = useState(false);

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

    const openModal = () => {
        setShowModal(true);
        // console.log("click");
    }

    return (
        <div className="nweet">
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input type="text" placeholder="Edit Your nweet" value={newNweet} required autoFocus onChange={onChange} className="formInput" />
                    <input type="submit" value="Update Nweet" className="formBtn" />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
            ):(
                    <>
                    {showModal ? <div className="modal"><Modal setShowModal={setShowModal} /><img src={nweetObj.attachmentUrl} onClick={() => setShowModal(false)} /></div> : null}
                    
                    <h className="userName">@ {nweetObj.userName} <span className="nweetTime">{formatDate(nweetObj.createdAt)}</span></h>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && 
                        <div>
                            <img src={nweetObj.attachmentUrl} onClick={openModal} className="attachment" />
                            
                        </div>}
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
    )};   
    export default Nweet;
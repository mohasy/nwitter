import { authService, dbService } from "fbase";
import React,{useEffect, useState} from "react";
import { useHistory } from "react-router";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

export default ( {refreshUser, userObj} ) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if (userObj) {
            if (userObj.displayName === null) {
                await userObj.updateProfile({
                    displayName: "User",
                });
            }
        }

        if(userObj.displayName !== newDisplayName){
            await updateProfile(await authService.currentUser, {
                displayName: newDisplayName,
                });
        }
        
        refreshUser();
            
    }

    const getMyNweets = async() => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid)
        );
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });
    }
    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
            <input onChange={onChange} type="text" autoFocus placeholder="닉네임" value={newDisplayName} className="formInput" />
            <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10, }} />
        </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};
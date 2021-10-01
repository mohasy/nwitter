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
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="닉네임" />
            <input type="submit" value="프로필 수정" />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
import { authService } from "fbase";
import React from "react";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import AuthForm from "components/AuthForm";

    //login
const Auth =  () => {
    const onSocialClick = async (event) => {
        // console.log(event.target.name);
        const {
            target:{name},
        } = event;

        let provider;

        try{
            if (name === "google"){
                provider = new GoogleAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
            } 
            else if (name === "github"){
                provider = new GithubAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GithubAuthProvider.credentialFromResult(result);
            }
            // await authService.signInWithPopup(provider);

        }catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            <AuthForm />
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with GitHub</button>

            </div>
        </div>
    );
};
export default Auth;


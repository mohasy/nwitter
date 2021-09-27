import { authService } from "fbase";
import React, {useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

    //login
const Auth =  () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
      const { target: {name, value} } = event;

      //name이 email과 같으면 email input에 값 setEmail
      if (name === "email") {
          setEmail(value);
          //password와 같으면 password input에 값 setPassword
        } else if (name === "password"){
            setPassword(value);
        }
    };

    const onSubmit = async(event) => {
        event.preventDefault();  
        try {
            let data;

            if(newAccount) {
                //account 생성
                data = await createUserWithEmailAndPassword(authService, email, password);
            }else {
                //로그인
                data = await signInWithEmailAndPassword(authService, email, password);
            }

            console.log(data);

        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
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
            {/*로그인 폼 */}
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ? "Create Account" : "Log In" } />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with GitHub</button>

            </div>
        </div>
    );
};
export default Auth;


import React, { useState } from "react";
import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthForm = () => {
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

    
    return (
        <>
        {/*로그인 폼 */}
        <form onSubmit={onSubmit} className="container">
            <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} className="authInput" />
            <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput" />
            <input type="submit" value={newAccount ? "Create Account" : "Log In" } className="authInput authSubmit" />
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    )
};

export default AuthForm;
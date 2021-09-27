import React, {useState} from "react";

    //login
const Auth =  () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    const onSubmit = (event) => {
        event.preventDefault();  
    };

    return (
        <div>
            {/*로그인 폼 */}
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value="Log In" />
            </form>
            <div>
                <button>Continue with Google</button>
            </div>
        </div>
    );
};
export default Auth;


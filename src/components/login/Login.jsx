import React, { useState } from 'react'
import { useOutletContext } from "react-router-dom";
import LoginForm from './LoginForm';


function Login() {
    const [accountForm, setAccountForm] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const { attemptLogin } = useOutletContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [createAccount, setCreateAccount] = useState(false);

    function createUser(e) {
        e.preventDefault();
        const userData = {
            email: newEmail,
            password_hash: newPassword
        };
        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(userData),
        })
        .then((response) => response.json())
        .then((newUser) => {
            setNewEmail("");
            setNewPassword("");
            attemptLogin({ email: newEmail, password: newPassword });
        });
    }

    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);

    const handleChangeNewEmail = (e) => setNewEmail(e.target.value);
    const handleChangeNewPassword = (e) => setNewPassword(e.target.value);

    const handleCreateAccount = () => {
        setAccountForm(!accountForm)
        setCreateAccount(!createAccount)
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        attemptLogin({ email: email, password: password });
    }

    return (
    <div>
        {!createAccount && 
            <div>
                <h2>Sign In</h2>
                <br/>
                <LoginForm submitText={"Login"} handleSubmit={handleSubmit} handleChangeEmail={handleChangeEmail} email={email} handleChangePassword={handleChangePassword} password={password}/>
                <br/>
                <h2>OR</h2>
                <br/>
                <button onClick={handleCreateAccount}>Create Account</button>
            </div>
        }
        {accountForm ? (
            <div>
                <h2>Create Account</h2>
                <br/>
                <LoginForm submitText={"Submit"} handleSubmit={createUser} handleChangeEmail={handleChangeNewEmail} email={newEmail} handleChangePassword={handleChangeNewPassword} password={newPassword}/>
                <br/>
                <h2>OR</h2>
                <br/>
                <button onClick={handleCreateAccount}>Login</button>
            </div>
            ) : ("")
        }
    </div>
    );
}

export default Login
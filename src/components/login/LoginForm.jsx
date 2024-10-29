import React from "react";

const LoginForm = ({submitText, handleSubmit, handleChangeEmail, email, handleChangePassword, password}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="contact__form-div">
                    <label className="contact__form-tag">Email</label>
                    <input type="text" name="email" className='contact__form-input' placeholder='Username' onChange={handleChangeEmail} value={email} />
                </div>
                
                <div className="contact__form-div">
                    <label className="contact__form-tag">Password</label>
                    <input type="password" name="password" className='contact__form-input' placeholder='Password' onChange={handleChangePassword} value={password}/>
                </div>

                <div className="contact__form-div">
                    <label className="contact__form-tag">First Name</label>
                    <input type="text" name="firstName" className='contact__form-input' placeholder='First Name' />
                </div>

                <div className="contact__form-div">
                    <label className="contact__form-tag">Last Name</label>
                    <input type="text" name="lastName" className='contact__form-input' placeholder='Last Name' />
                </div>

                <div className="contact__form-div">
                    <label className="contact__form-tag">Phone Number</label>
                    <input type="tel" name="phoneNumber" className='contact__form-input' placeholder='Phone Number' />
                </div>
                <br />
                <div>
                    <button onClick={handleSubmit}>{submitText}</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;

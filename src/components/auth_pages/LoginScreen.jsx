import { useEffect, useState } from "react";
import {supabase} from '../../lib/helper/supabase_client'
import validator from 'validator';
import './LoginPopup.css';

export const LoginScreen = ({setToken}) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",agreeTerms:false,validFullName: true, validEmail: true, validPassword: true,validForm: true
      });

     

      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const [wait,setWait] = useState('');
      const [autScreen, setAutScreen] = useState('sign-in');

    //   let supa_token = sessionStorage.getItem('token','');
    //   const [token, setToken] = useState(supa_token ? JSON.parse(supa_token) : false);

    // console.log(token);
    
      const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
        if (password.length < minLength) {
          return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasUpperCase) {
          return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowerCase) {
          return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumbers) {
          return 'Password must contain at least one number.';
        }
        if (!hasSpecialChars) {
          return 'Password must contain at least one special character.';
        }
    
        return '';
      };
    
      const handleChange = (e) => {
        if(e.target.name === "agreeTerms"){
            handleFormData(e.target.name,e.target.checked);
        }else{
            handleFormData(e.target.name,e.target.value);
        }
        
      }

      const handleFormData = (name, value) => {

        
        setFormData((prevFormData) =>{
            return {...prevFormData,[name]:value}
        });

      }
    
      async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setWait('');
        setSuccess("")

        setFormData((prevFormData) =>{
            return {...prevFormData, validFullName:true, validEmail: true,validPassword: true, validForm:true}
          });
        
        let validForm = true;

        try{

            
            if(autScreen === 'sign-up'){
                if(formData.fullName === ""){
                    handleFormData('validFullName', false);
                    validForm = false;
                }
            }

            if(autScreen === 'sign-in' || autScreen === 'sign-up'){
                if(formData.email === ""){
                    handleFormData('validEmail', false);
                    validForm = false;
                }

                if(formData.password === ""){
                    handleFormData('validPassword', false);
                    validForm = false;
                }               
            }            

            console.log(autScreen)                
            
            if(!validForm){
                setError("Please enter the required fields");
                return false;
            }

            if(validForm){
                if (!validator.isEmail(formData.email)) {
                setError('Please enter a valid email address.');
                handleFormData('validEmail', false);
                //handleFormData('validForm', false);
                validForm = false;
                return false;
                }
            }

            if(validForm){    
                const passwordError = validatePassword(formData.password);
                if (passwordError) {
                    setError(passwordError);
                    handleFormData('validPassword', false);
                    //handleFormData('validForm', false);
                    validForm = false;
                    return false;
                }
            }

            if(autScreen === 'sign-up'){
                if(!formData.agreeTerms){
                    setError('Please agree terms and conditions.');
                    handleFormData('validAgreeTerms', false);
                    validForm = false;
                    return false;
                }
            }

            console.log("Valid form",validForm);

            if(!validForm)
                return false;
            
            setError("");

            setWait('Please Wait!');

            if(autScreen === 'sign-in'){
                const response = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (response.error) {
                    setWait('');
                    throw response.error
                }else{
                    setWait('');
                    setSuccess('Signup successfully logged in.');
                    let response_data = response.data
                    setToken(response_data);
                }

            }else{
                const response = await supabase.auth.signUp(
                    {
                        email: formData.email,
                        password: formData.password,
                        option: {
                            data: {
                                first_name: 'Salim',
                                last_name: 'Shaikh',
                                // display_name: formData.fullName,
                            }
                        }
                    }
                )

                if (response.error) {
                    setWait('');
                    throw response.error
                }else{
                    setWait('');
                    setSuccess('Signup successful! Please check your email to confirm your account.');  
                }

                
            }   
            
    
        } catch (error){
          if (error.message.includes('Email rate limit exceeded')) {
            setError('Too many requests. Please try again later.');
          } else {
            setError(error.message);
          }
        }
        return false;
      }

      const changeAuthScreen = (s) => {
        setWait('');
        setError('');
        setSuccess('');
        setAutScreen(s)
      }

      useEffect(() => {
        
      },[])

      return (        
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{autScreen === "sign-up" ? "Sign Up" : "Sign In"}</h2>
                    {/* <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} alt="" /> */}
                </div>

                {wait && <div className="alert alert-primary" role="alert">{wait}</div>}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">{success}</div>}

                <div className="login-popup-inputs">
                    {autScreen === "sign-up" ? <input type="text" placeholder="Full Nmae" name="fullName" onChange={handleChange} className={`fullname-field ${formData.validFullName === true ? 'valid' : 'invalid'}`}/> : <></>}
                    
                    <input type="text" placeholder="Email" name="email" onChange={handleChange} 
                    className={`email-field ${formData.validEmail === true ? 'valid' : 'invalid'}`} />

                    <input type="text" placeholder="Password" name="password" onChange={handleChange}                    
                    className={`password-field ${formData.validPassword === true ? 'valid' : 'invalid'}`} />
                </div>

                <button>{autScreen === "sign-up" ? "Create account" : "Login"}</button>
                {autScreen === "sign-up" ? <div className="login-popup-condition">
                <p className="terms-condition"><label><input type="checkbox" name="agreeTerms" value='yes' onChange={handleChange}  />By Continuing, i agree to the terms of use & privacy policy</label></p>
                </div> : <></>}

                

                {autScreen === 'sign-in' ? <p>Create a new account? <span onClick={() => {changeAuthScreen('sign-up')}}>click here</span></p> : <p>Already have an account? <span onClick={() => {changeAuthScreen('sign-in')}}>Login here</span></p>}
                
                
            </form>

        </div>
        
      )
}

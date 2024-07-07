import { useEffect, useState } from "react";
import { LoginScreen } from "./components/auth_pages/LoginScreen";
import {supabase} from './lib/helper/supabase_client'

const App = () => {

  // let supa_token = sessionStorage.getItem('token',);
  // const [token, setToken] = useState(supa_token ? JSON.parse(supa_token) : false);
  // let supa_token = sessionStorage.getItem('token',);

  const [token, setToken] = useState(false);
  if(token){
     //sessionStorage.setItem('token',JSON.stringify(token));
     //console.log("set token sessionStorage")
  }

  useEffect(() => {
    // let login_string = sessionStorage.getItem('token');
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
      console.log("set token useEffect")
    }
  },[]);

  

  function handleLogout(){    
    sessionStorage.removeItem('token');
    setToken(false);
  }


  function updateProfile(){
    let userId = token.user.id;

    // console.log(token.user)

    console.log(userId)

    updateUser('96d3c0ae-2e3e-4afb-91c7-afaa0d04c8f8','Salim', 'Shaikh');
  }

  const updateUser = async (userId, firstName, lastName) => {
    const { data, error } = await supabase
      .from('users')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', userId);


      console.log('User updated error:', error);
      console.log('User updated data:', data);
  
    // if (error) {
    //   console.error('Error updating user:', error);
    // } else {
    //   console.log('User updated:', data);
    // }
  };


  return (
    <div className="app">
      {token ? <div>



        {token.user.user_metadata.email}

        {/* { console.log(token.user.user_metadata) } */}

        <button onClick={handleLogout}>Logout</button>

        <button onClick={updateProfile}>Update file</button>


      </div> : <LoginScreen setToken={setToken} />}      
    </div>
  )
  
}

export default App;
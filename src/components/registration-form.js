import React, { useState, useEffect } from 'react'; 
import { Link, Redirect } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import "../styles/App.css";

export const RegistrationForm = () => {
  // split state into different declarations
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [authToken, setAuthToken] = useState("") 
  const [loggedIn, setLoggedIn] = useState(true)
  const [validUsername, SetValidUsername] = useState('')
  
  const logIn = data => {
  
    console.log('user data: ',data);

    setUsername(username)
    setLoggedIn(loggedIn)
    localStorage.removeItem("logout")

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

      return fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username,
          password
        })
      })
      .then(res => {
        console.log('res', res.body)
        return res.json();
      })
      .then( ( auth ) => {  
        console.log('auth: ',auth)
        if (auth.hasOwnProperty("authToken")){
          localStorage.setItem("user", username);
          localStorage.setItem("loggedIn", loggedIn);
          localStorage.setItem("authToken", auth.authToken);
          setAuthToken(auth)
        }
        return auth;
      })
      .catch(err => {
        const { code } = err;
        const message = code === 401 ? 'Incorrect username or password' : 'Unable to login, please try again';
        
        return Promise.reject(
          new Error({
            _error: message
          })
        )
      });
  }

  const validateUsername = async (username) => {
    // send username to server on Change of `username` state
    // server should check if username exists 

    const res = await fetch(
      `${API_BASE_URL}/users/?search=${username}`
    );

    // Pull out the data from response
    const _username = await res.json();
   
    // if the username alreadu exists in the DB
    if(_username.length > 0 && validUsername !== '') {
      console.log('username exists', _username)
      localStorage.setItem('validUsername', 'Username taken. Pick another.')
      SetValidUsername(false)
      return _username
    } 
    
    console.log('new user', _username)
    localStorage.setItem('validUsername', 'Valid Username')
    SetValidUsername(true)
    return _username;
  }

  useEffect(() => {
    validateUsername(username);
  }, [username])
  
  const handleSubmit = e => {
    e.preventDefault(e); 
   
    // console.log(`username: ${username}, password: ${password}, confirmPassword: ${confirmPassword}, email: ${email}, confirmEmail: ${confirmEmail}`)

    setUsername(username);
    setPassword(password);
    setConfirmPassword(confirmPassword);
    setEmail(email);
    setConfirmEmail(confirmEmail);

    return fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        username,
        password,
        confirmPassword,
        email,
        confirmEmail
      })
    })
    .then(res => {
      // console.log('res', res)
      localStorage.setItem("registered", true)
      return res.json();
      })
      .then(data => {
        logIn(data)
      })
      .catch(err => {
        console.log(err)
        if(err === 'TypeError: Failed to fetch'){
          console.log('duplicate error')
          return Promise.reject(err)
        }
        console.log(err)
      })
      };

  let usernameValidation;
  console.log('validUsername: ',validUsername)
  if(validUsername === ''){
    usernameValidation = <p></p>
  } else if (!validUsername) {
    usernameValidation = <p>Username is taken. Choose another.</p>
  }

  return (
    <div className="registration">
    {
      localStorage.loggedIn ? (
        <Redirect to="/dashboard" />
      ) : (
      <form className="registration-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name:
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          type="text"
          name="name"
          required
        />
        </label>

        {usernameValidation}

        <label htmlFor="username">Username:
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          type="text"
          name="username"
          required
        />
        </label>
        <label htmlFor="password">Password:
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          name="password"
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
        />
        </label>
        <label htmlFor="passwordConfirm">Confirm Password:
        <input
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          type="password"
          name="passwordConfirm"
          required
          pattern={password} 
          title={`password: "${password}" & confirmPassword: "${confirmPassword}" must match`}
        />
        </label>
        <label htmlFor="email">E-mail:
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          name="email"
          pattern="^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$"
          required
        />
        </label>
        <label htmlFor="emailConfirm">Confirm Email:
        <input
          value={confirmEmail}
          onChange={e => setConfirmEmail(e.target.value)}
          placeholder="Confirm Email"
          type="email"
          name="emailConfirm"
          pattern={email}
          title={`email: "${email}" & confirmEmail: "${confirmEmail}" must match`}
          required
        />
        </label>
        <button 
          waves="light "
          type="submit" 
          className="login-submit"
          disabled={ !username || !password || !validUsername }
        >
          Submit
        </button>
        <Link to="/">Go Back</Link>
      </form>
      )}
      
    </div>
  );
}


export default RegistrationForm;
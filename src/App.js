import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';



initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function App() {
  const [logIn, setLogIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [user, setUser] = useState({});


  const auth = getAuth()
  const handleSignUP = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLogIn(!logIn);
  }

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        setUser(user);

      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const user = result.user;
        setUser(user);
      })
  }
  const handleNameChange = e => {
    setName(e.target.value);

  }
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }

  const handleSignUPAndLogIn = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMessage('Passwords must be at least 6 charecters long');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setErrorMessage('There must contain two upper case letter');
      return;
    }

    logIn ? loginUser() : createUser()

  }

  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        setUser(user);
        setErrorMessage('');
      }).catch(error => setErrorMessage(error.message))
  }

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        setUser(user);
        verifyEmail();
        setErrorMessage('')
        setUserName();
      }).catch(error => setErrorMessage(error.message))
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {

      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage('A message sent to your mail');

      }).catch(error => setErrorMessage(error.message))
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => { }).catch(error => setErrorMessage(error.message))
    setSuccessMessage('A message sent to your mail');
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
        setErrorMessage('');
        setSuccessMessage('');
      })

  }


  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'hotpink' }}>Authentication using Email/Password and Pop-ups</h1>

      {

        !user.displayName ? <Box sx={{ display: 'flex', p: 10, mx: 5 }}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Button onClick={handleGoogleSignIn} sx={{ width: '50%' }} size="large" variant="contained" color="warning" startIcon={<GoogleIcon />}>Sign in with google</Button>
            </Grid>

            <Grid item xs={12}>
              <Button onClick={handleGithubSignIn} sx={{ width: '50%' }} size="large" variant="contained" color="success" startIcon={<GitHubIcon />}>Sign in with Github</Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleFacebookSignIn} sx={{ width: '50%' }} size="large" variant="contained" color="primary" startIcon={<FacebookIcon />}>Sign in with Facebook</Button>
            </Grid>
            <Grid item xs={12}>
              <Button sx={{ width: '50%' }} size="large" variant="contained" color="info" startIcon={<TwitterIcon />}>Sign in with Twitter</Button>
            </Grid>
          </Grid>



          <form onSubmit={handleSignUPAndLogIn} >
            <h1 style={{ color: 'blue' }}>{logIn ? 'Please Log In' : 'Please Sign Up'}</h1>
            {
              logIn ||
              <TextField onBlur={handleNameChange} sx={{ width: '100%', mb: 2 }} label="Enter Name" variant="outlined" required />


            }
            <TextField onBlur={handleEmailChange} sx={{ width: '100%', mb: 2 }} type="email" label="Enter Email" variant="outlined" required />


            <TextField onBlur={handlePasswordChange} sx={{ width: '100%' }} type="password" label="Enter Password" variant="outlined" required
            />
            <span style={{ display: 'block', color: 'red', marginBottom: '20px' }}>{errorMessage}</span>

            <Button sx={{ width: '100%' }} variant="contained" color="primary" type="submit">{logIn ? 'Log In' : 'Sign Up'}</Button>

            <p style={{ display: "flex", justifyContent: "space-between", color: "blue", cursor: "pointer" }}>
              <span onClick={handleResetPassword}>{logIn && 'Forgot password?'} </span>
              <span onClick={handleSignUP}> {logIn ? "Don't have an account?" : "Already have an account?"}</span>
            </p>
            <span style={{ display: 'block', color: 'red', marginBottom: '20px' }}>{successMessage}</span>

          </form>

        </Box> : <Box sx={{ textAlign: 'center' }}>

          {
            user.photoURL ? <img src={user.photoURL} alt="" /> : <p> No image for this user</p>
          }
          {
            user.displayName ? <h3>Name: {user.displayName}</h3> : <h3>Name Unavailable</h3>
          }

          <p>Email: {user.email}</p>
          <Button onClick={handleSignOut} sx={{ width: '25%' }} variant="contained" color="primary" type="submit">Sign Out</Button>

        </Box>
      }




    </div >
  );
}

export default App;

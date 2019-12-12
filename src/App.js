import React from 'react';

import firebase from './firebase.js';
import UserForm from './components/UserForm.js';

import List from "./components/List";
import ErrorMessage from './components/ErrorMessage.js';

import './App.css';

import logo from './assets/logo.svg'
import './fonts/keyrune.ttf';


const localFirebaseRef = 'user-ref';
const localUsernameRef = 'user-name';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userIsLoggedIn: false,
      isSigningUp: false,
      talkingToFirebase: false,
      userRef: '',
      username: '',
      showError: false,
      errorMessage: ''
    }
  }
  componentDidMount() {
    //Check if the user has a localstorage for thing
    const localUserRef = localStorage.getItem(localFirebaseRef);
    const localUsername = localStorage.getItem(localUsernameRef);
    if(localUserRef !== null) {
      this.setState({
        userIsLoggedIn: true,
        userRef: localUserRef,
        username: localUsername ? localUsername : ''
      })
    }
  }

  showTheUserAnError = (messageToShow) => {
    this.setState({
      showError: true,
      errorMessage: messageToShow
    });
  }

  attemptLogin = (usernameToLoginWith) => {
    this.setState({
      talkingToFirebase: true
    });
    const dbRef = firebase.database().ref();
    dbRef.once('value', (db) => {
      const userbase = db.val();
      for(let index in userbase){
        if(usernameToLoginWith === userbase[index].username){
          this.userHasLoggedIn(index, usernameToLoginWith);
          return;
        }
      }
      //The account doesn't exist
      this.loginError(usernameToLoginWith);
      this.setState({
        talkingToFirebase: false
      });
    })
  }

  userHasLoggedIn = (userReference, loggedInUsername) => {
    this.setState({
      userRef: userReference,
      userIsLoggedIn: true,
      username: loggedInUsername,
      talkingToFirebase: false
    });
    localStorage.setItem(localFirebaseRef, userReference);
    localStorage.setItem(localUsernameRef, loggedInUsername);
  }

  loginError = (usernameThatFailed) => {
    this.showTheUserAnError(usernameThatFailed + " is not registered!")
  }

  attemptSignup = (usernameToSignupWith) => {
    this.setState({
      talkingToFirebase: true
    });
    const dbRef = firebase.database().ref();
    dbRef.once('value', (db) => {
      const userbase = db.val();
      for(let index in userbase){
        if(usernameToSignupWith === userbase[index].username){
          //The account already exists
          this.signupError(usernameToSignupWith);
          this.setState({
            talkingToFirebase: false
          });
          return;
        }
      }
      this.signUserUp(usernameToSignupWith);
    })
  }

  signupError = (takenUsername) => {
    // alert("Oopsy doopsy thewe was a fucky wucky uwu! " + takenUsername + " is already taken owo!");
    this.showTheUserAnError(takenUsername + " is already taken!");
  }

  signUserUp = (usernameToSignupWith) => {
    const newUser = {
      username: usernameToSignupWith,
      // This is only to show object structure (firebase won't recognize it as a thing)
      // cards: [] 
    }
    firebase.database().ref().push(newUser);
    //BIG POSITIVE FEEDBACK
    // alert("Signup Success!");
    this.showTheUserAnError("Signup was Successful!");
    this.setState({
      talkingToFirebase: false
    });
  }

  logUserOut = () => {
    localStorage.removeItem(localFirebaseRef);
    this.setState({
      userRef: '',
      userIsLoggedIn: false
    });
  }


  swapIsSigningUp = () => {
    this.setState({
      isSigningUp: !this.state.isSigningUp
    });
  }


  //Call back functions from the ErrorMessage component!
  showError = (message) => {
    this.showTheUserAnError(message);
  }
  hideError = () => {
    this.setState({
      showError: false
    });
  }


  render() {
    return(
      <div>
        {/* Start of Wrapper */}
        <div className="wrapper">
          <header>
            <div className="innerWrapper">
              <img className="logo" src={logo} alt="A wax seal." />
              <h1>Dear Magic</h1>
              <h2>A personal buylist for <span>Magic: The Gathering</span></h2>
            </div>
          </header>

          <main>
            { 
              this.state.showError
                ? <ErrorMessage errorText={this.state.errorMessage} onEnd={this.hideError} />
                : null
            }
            { 
              // Is the user logged in?
              this.state.userIsLoggedIn
                // Show them their list!
                ? <List account={this.state.userRef} username={this.state.username} logoutCallback={this.logUserOut} />
                // Show them the login/signup form -> Are they signing up?
                : this.state.isSigningUp
                    // Show them the signup form
                    ? <UserForm 
                        action="Signup" 
                        allowAction={this.state.talkingToFirebase} 
                        callback={this.attemptSignup} 
                        showError={this.showError} 
                      >
                        <button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">
                          Already a user?
                        </button>
                      </UserForm>
                    // Show them the login form
                    : <UserForm 
                        action="Login" 
                        callback={this.attemptLogin}  
                        showError={this.showError}
                        allowAction={this.state.talkingToFirebase} 
                      >
                        <button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">
                          Need an account?
                        </button>
                      </UserForm>
            }
          </main>

        <footer>
            <p>mikosramek © 2019</p>
        </footer>

        </div> {/* End of Wrapper */}
      </div> /* End of App div */
    );
  }
};
export default App;

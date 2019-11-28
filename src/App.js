import React from 'react';

import firebase from './firebase.js';
import UserForm from './UserForm.js';

import List from "./List.js";

import './App.css';

import logo from './assets/logo.svg'


const localFirebaseRef = 'user-ref';
const localUsernameRef = 'user-name';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userIsLoggedIn: false,
      isSigningUp: false,
      userRef: '',
      username: ''
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

  
  attemptLogin = (usernameToLoginWith) => {
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
    })
  }

  userHasLoggedIn = (userReference, loggedInUsername) => {
    this.setState({
      userRef: userReference,
      userIsLoggedIn: true,
      username: loggedInUsername
    });
    localStorage.setItem(localFirebaseRef, userReference);
    localStorage.setItem(localUsernameRef, loggedInUsername);
  }

  loginError = (usernameThatFailed) => {
    alert(usernameThatFailed + " is not registered");
  }

  attemptSignup = (usernameToSignupWith) => {
    const dbRef = firebase.database().ref();
    dbRef.once('value', (db) => {
      const userbase = db.val();
      for(let index in userbase){
        if(usernameToSignupWith === userbase[index].username){
          //The account already exists
          this.signupError(usernameToSignupWith);
          return;
        }
      }
      this.signUserUp(usernameToSignupWith);
    })
  }

  signupError = (takenUsername) => {
    alert("Oopsy doopsy thewe was a fucky wucky uwu! " + takenUsername + " is already taken owo!");
  }

  signUserUp = (usernameToSignupWith) => {
    const newUser = {
      username: usernameToSignupWith,
      // This is only to show object structure (firebase won't recognize it as a thing)
      // cards: [] 
    }
    firebase.database().ref().push(newUser);
    //BIG POSITIVE FEEDBACK
    alert("Signup Success!");
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


  render() {
    return(
      <div>
        <div className="wrapper">
          <header>
              <div className="innerWrapper">
              	<img className="logo" src={logo} alt="A wax seal." />
              	<h1>Dear Magic</h1>
              	<h2>A personal buylist</h2>
              </div>
          </header>

          { 
            this.state.userIsLoggedIn
              ? <List account={this.state.userRef} username={this.state.username} logoutCallback={this.logUserOut} />
              : this.state.isSigningUp
                  ? <UserForm action="Signup" callback={this.attemptSignup}>
                      <button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">Already a user?</button>
                    </UserForm>
                  : <UserForm action="Login" callback={this.attemptLogin}>
                      <button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">Need an account?</button>
                    </UserForm>
          }

        <footer>
            <p>mikosramek © 2019</p>
        </footer>
        </div>
      </div> /* End of App div */
    );
  }
};
export default App;

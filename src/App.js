import React from 'react';


import firebase from './firebase.js';
import UserForm from './UserForm.js';

import List from "./List.js";

import './App.css';


const localRef = 'user-ref';

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
    const localUserRef = localStorage.getItem(localRef);
    if(localUserRef !== null) {
      this.setState({
        userIsLoggedIn: true,
        userRef: localUserRef
      })
    }
  }

  
  //TO DO: REFACTOR THIS SO IT IS 2 SEPERATE AND CLEAR FUNCTIONS
  //ALSO MAYBE STORE THE USERNAME SO IT CAN BE USED IN THE LIST ????
  doesDatabaseContainUsername = (username, itDoesCallback, itDoesNotCallback) => {
    const dbRef = firebase.database().ref();
    dbRef.once('value', (db) => {
      const userbase = db.val();
      for(let index in userbase){
        if(username === userbase[index].username){
          itDoesCallback(true, index);
          return;
        }
      }
      itDoesNotCallback(false, username);
    })
  }

  attemptLogin = (usernameToLoginWith) => {
    this.doesDatabaseContainUsername(usernameToLoginWith, this.userHasLoggedIn, this.accountError);
  }
  userHasLoggedIn = (loggedIn, userReference) => {
    this.setState({
      userRef: userReference,
      userIsLoggedIn: loggedIn
    });
    localStorage.setItem(localRef, userReference);
  }

  attemptSignup = (usernameToSignupWith) => {
    this.doesDatabaseContainUsername(usernameToSignupWith, this.accountError, this.userCanSignUp);
  }
  userCanSignUp = (throwaway, usernameToSignupWith) => {
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
    localStorage.removeItem(localRef);
    this.setState({
      userRef: '',
      userIsLoggedIn: false
    });
  }

  accountError = (throwaway, takenUsername) => {
    console.log(takenUsername, " - error");
    alert("Oops thewe was a fucky wucky! uwu");
  }



  swapIsSigningUp = () => {
    this.setState({
      isSigningUp: !this.state.isSigningUp
    });
  }


  addNewCard = (cardName, cardQuantity) => {
    const newCard = {
      name: cardName,
      quantity: cardQuantity,
      bought: false
    }
    const userCardsRef = firebase.database().ref(`${this.state.userRef}/cards`);
    userCardsRef.once('value', (data) => {
      //create new array based on data.cards
      //and then set the data value back to it

      //If there isn't an array, give it a new array
      //If there is one, spread it and add the new card
      let newCardArray;
      if(data.val() === null){
        newCardArray = [newCard];
      }else{
        newCardArray = [...data.val(), newCard];
      }
      userCardsRef.set(newCardArray);
    });
  }

  render() {
    return(
      <div>
        <div className="wrapper">
          <header>
              <h1>Dear Magic</h1>
              <h2>A personal buylist</h2>
          </header>

          { 
            this.state.userIsLoggedIn
              ? <List account={this.state.userRef} username={this.state.userRef} logoutCallback={this.logUserOut} newCardCallback={this.addNewCard} />
              : this.state.isSigningUp
                  ? <UserForm action="Signup" callback={this.attemptSignup}><button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">Already a user?</button></UserForm>
                  : <UserForm action="Login" callback={this.attemptLogin}><button type="button" onClick={this.swapIsSigningUp} className="userActionSwapButton">Create Account</button></UserForm>
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

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

import Card from './Card.js';
import ErrorMessage from './ErrorMessage.js';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      newCard: '',
      newCardQuantity: 1,
      isShowingNewCardForm: false,
      gettingCardDetails: false,
      showApiError: false,
      errorMessage: '',
      isConfirmingArchive: false
    }
  }
  componentDidMount() {
    const userRef = firebase.database().ref(this.props.account);
    userRef.on('value', (account) => {
      const cardArray = account.val().cards;
      if(cardArray !== undefined){
        this.setState({
          cards: cardArray
        })
      }else{
        this.setState({
          cards: []
        })
      }
    });
  }

  queryNewCard = (event) => {
    event.preventDefault();
    this.setState({
      gettingCardDetails: true
    });
    
    if(this.state.newCard !== ''){    
      //
      axios({
        method: 'GET',
        url: 'https://api.scryfall.com/cards/named',
        dataResponse: 'json',
        params: {
          fuzzy:this.state.newCard,
        },
        timeout: 10000,
      }).then( (result) => {
        //color_identity
        //multiverse_ids[0] -> hand off
        //name
        //prices
        //rarity

        //foil
        //image_uris.small

        //Make another call to get all the printings of the card
        axios({
          method: 'GET',
          url: result.data.prints_search_uri,
          dataResponse: 'json',
        }).then( (cardSets) => {
          //Throw it into a variable
          const arrayOfSets = cardSets.data.data;

          //Push it into an array, and make sure there aren't any duplicates
          const printings = [];
          arrayOfSets.forEach((card) => {
            if(!printings.includes(card.set)){
              printings.push(card.set);
            }
          });
          //Create the card object to throw at firebase
          const newCard = {
            name: result.data.name,
            quantity: this.state.newCardQuantity,
            rarity: result.data.rarity,
            identity: result.data.color_identity,
            sets: printings,
            latestSet: result.data.set,
            prices: result.data.prices,
            hasFoil: result.data.foil,
            imgUrl: result.data.image_uris.small,
            bought: false
          }
          //If the sets or identity are 0 (if the api doesn't have them or they're colorless), create a dummy array so firebase doesn't delete it
          if(newCard.sets.length === 0){
            newCard.sets = ['No recorded sets.']
          }
          if(newCard.identity.length === 0) {
            newCard.identity = ['Colorless']
          }
          //Pass the data to the function
          this.addNewCard(newCard);
          //Show the form for user submition once again
          this.setState({
            gettingCardDetails: false
          });
        }).catch( (error) => {
          this.handleError(error);
        });
      }).catch( (error) => {
        //General card is not found!
        this.handleError(error);
      });
    }else{
      //SCREAM AT THE USER
    }
  }

  //IF statements from axios docs
  handleError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      this.showTheUserAnError(error.response.data.details);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      this.showTheUserAnError(error.message);
    }
  }
  showTheUserAnError = (messageToShow) => {
    this.setState({
      showApiError: true,
      errorMessage: messageToShow
    });
  }
  hideError = () => {
    this.setState({
      showApiError: false,
      errorMessage: '',
      gettingCardDetails: false
    });
  }

  addNewCard = (card) => {
    const userCardsRef = firebase.database().ref(`${this.props.account}/cards`);
    userCardsRef.once('value', (data) => {
      //If there isn't an array, give it a new array
      //If there is one, spread it and add the new card
      let newCardArray;
      if(data.val() === null){
        newCardArray = [card];
      }else{
        newCardArray = [...data.val(), card];
      }
      userCardsRef.set(newCardArray);
    });
    this.setState({
      newCard: '',
      newCardQuantity: 1
    });
  }

  updateCardToBought = (index) => {
    const cardsRef = firebase.database().ref(this.props.account).child(`cards/${index}`);
    cardsRef.once('value', (data) => {
      const currentData = data.val();
      cardsRef.update({
        bought: !currentData.bought
      });
    });
  }

  removeBoughtCards = () => {
    const cardsRef = firebase.database().ref(this.props.account).child(`cards`);
    const filteredCards = this.state.cards.filter((card) => {
      return !card.bought
    });
    cardsRef.set(filteredCards);
  }

  toggleIsShowingNewCardForm = () => {
    this.setState({
      isShowingNewCardForm: !this.state.isShowingNewCardForm
    })
  }

  toggleisConfirmingArchive = () => {
    this.setState({
      isConfirmingArchive: !this.state.isConfirmingArchive
    })
  }

  render() {
    return(
      <div className="innerWrapper">
        <h3>Hi, {this.props.username}! Here is your list:</h3>

        <div className={`newCardMenuButton ${this.state.isShowingNewCardForm ? 'show' : ''}`}>
          <button onClick={this.toggleIsShowingNewCardForm}><i className='fas fa-times' aria-label=""></i></button>
        </div>
        <div className={`newCardDiv ${this.state.isShowingNewCardForm ? 'show' : ''}`}>  
        	{
            //Is the api call being made?
            this.state.gettingCardDetails
              //Is there an API error?
        	    ? this.state.showApiError
                  ? <ErrorMessage errorText={this.state.errorMessage} onEnd={this.hideError} />
                  : <p>Fetching card data</p>
        	    : <form onSubmit={this.queryNewCard} className="newCardForm">
        	        <label htmlFor="newCardName">Card name:</label>
        	        <input type="text" id="newCardName" 
        	          value={this.state.newCard} 
        	          onChange={(e) => this.setState({newCard:e.target.value})} 
        	        />
                  <span></span>
        	        <label htmlFor="newCardQuantity">How many:</label>
        	        <input type="number" id="newCardQuantity" 
        	          value={this.state.newCardQuantity} 
        	          onChange={(e) => this.setState({newCardQuantity:e.target.value})}
        	          min="1" max="1337"  
        	        />
                  <span></span>
        	        <button>Add Card</button>
        	      </form>
        	}
        </div>
        <div 
          className={`clearBoughtButton ${this.state.isConfirmingArchive ? 'clearBoughtConfirming' : ''}`} 
        >
          {
            this.state.isConfirmingArchive 
              ? <button onClick={this.toggleisConfirmingArchive}><i className="fas fa-times-circle" aria-label="Cancel clearing bought cards."></i></button>
              : <button onClick={this.toggleisConfirmingArchive}>Clear Bought</button>
          }
          <button 
            onClick={this.removeBoughtCards} 
            className={`confirmClearButton ${this.state.isConfirmingArchive ? 'show' : ''}`}
          >
            <i className="fas fa-check-circle" aria-label="Confirm clearing bought cards."></i>
          </button>
        </div>

        <ul className="cardList">
          {
            this.state.cards !== undefined && this.state.cards.length > 0
              ? this.state.cards.map((item, index) => {
                return(
                  <Card key={index} checkOff={() => this.updateCardToBought(index)} card={item}/>
                )
              })
              : <li className="placeholderCard">Add cards by pressing the + icon!</li>
          }
        </ul>
        
        
        <button onClick={this.props.logoutCallback}>Log Out</button>
      </div>
    );
  }
};

export default List;
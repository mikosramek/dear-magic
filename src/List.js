//Import required modules
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

//Import Components
import Card from './Card.js';
import ErrorMessage from './ErrorMessage.js';
import ListInfo from './ListInfo.js';
import ConfirmationButton from './ConfirmatioButton.js';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      possibleCards: [],
      newCard: '',
      newCardQuantity: 1,
      isShowingNewCardForm: false,
      gettingCardDetails: false,
      showApiError: false,
      errorMessage: '',
      isShowingListInfo: false
    }
    this.textInput = React.createRef();
  }

  //Focus code found from
  //https://stackoverflow.com/questions/43145549/how-react-programmatically-focus-input
  focusOnCardInput = () => {
    this.textInput.current.focus();
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
    if(this.state.newCard !== ''){    
      this.setState({
        gettingCardDetails: true
      });
      //Inital call to find the card
      axios({
        method: 'GET',
        url: 'https://api.scryfall.com/cards/named',
        dataResponse: 'json',
        params: {
          fuzzy:this.state.newCard,
        },
        timeout: 10000,
      }).then( (result) => {
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
          this.focusOnCardInput();
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
  queryCardSuggestions = () => {
    if(this.state.newCard !== ''){
      axios({
        method: 'GET',
        url: 'https://api.scryfall.com/cards/autocomplete',
        dataResponse: 'json',
        params: {
          q:this.state.newCard,
        }
      }).then( (result) => {
        if(result.data.data.length > 0){
          this.setState({
            possibleCards: result.data.data
          })
        }else{
          this.setState({
            possibleCards: []
          })
        }
        
      }).catch( (error) => {
        this.handleError(error);
      });
    }
  }
  takeCardSuggestion = (event) => {
    const suggestion = event.target.value;
    this.setState({
      newCard: suggestion,
      possibleCards: []
    })
  }
  //IF statements from axios docs
  handleError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
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
    this.focusOnCardInput();
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
      possibleCards: [],
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

  removeAllCards = () => {
    const cardsRef = firebase.database().ref(this.props.account).child(`cards`);
    cardsRef.set([]);
    this.toggleIsConfirmingDeletion();
  }

  toggleIsShowingNewCardForm = () => {
    this.setState({
      isShowingNewCardForm: !this.state.isShowingNewCardForm
    });
    this.focusOnCardInput();
  }
  toggleIsShowingListInfo = () => {
    this.setState({
      isShowingListInfo: !this.state.isShowingListInfo
    });
  }

  

  render() {
    return(
      <div className="innerWrapper">
        <h3>Hi, {this.props.username}! Here is your list:</h3>

        <button className="logoutButton" onClick={this.props.logoutCallback}>Log Out</button>

        {/* Start of New Card Div */}
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
                    onChange={(e) => { this.setState({newCard:e.target.value}); this.queryCardSuggestions(); }} 
                    ref={this.textInput}
        	        />
                  <span></span>
                  {
                    this.state.possibleCards.map((pCard, index) => {
                      return <button value={pCard} onClick={this.takeCardSuggestion} type="button" key={pCard+index} className="cardSuggestion" style={{top: `${86 + 37*index}px`}} >{pCard}</button>
                    })
                  }
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
        </div> {/* End of New Card Div */}



        {/* Start of Info/Summary Panel */}
        <div className={`infoPanelButton ${this.state.isShowingListInfo ? 'show' : ''} ${this.state.isShowingNewCardForm ? 'shift' : ''}`}>
          <button onClick={this.toggleIsShowingListInfo}><i className="fas fa-receipt" aria-label=""></i></button>
        </div>
        <div className={`infoPanel ${this.state.isShowingListInfo ? 'show' : ''}`}>
          <ListInfo cards={this.state.cards}  />
          <ConfirmationButton action="Clear Bought" confirmationMessage="Clear bought cards?" confirmAction={this.removeBoughtCards} />
          <ConfirmationButton action="Clear All" confirmationMessage="Clear all cards?" confirmAction={this.removeAllCards} />
        </div> {/* End of Info/Summary Panel */}
        
        {/* Start of Card List */}
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
        </ul> {/* End of Card List */}
        
      </div> /* End of Inner Wrapper */
    );
  }
};

export default List;
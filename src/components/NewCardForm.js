import React from 'react';
import axios from 'axios';

import ErrorMessage from './ErrorMessage';

class NewCardForm extends React.Component {
  constructor() {
    super();
    this.state = {
      gettingCardDetails: false,
      newCard: '',
      newCardQuantity: 1,
      
      showApiError: false,
      errorMessage: '',

      suggestionTimeoutID: undefined,
      possibleCards: [],
    }
    this.textInput = React.createRef();
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
            bought: false,
            lastPriceCheck: new Date().toDateString()
          }
          //If the sets or identity are 0 (if the api doesn't have them or they're colorless), create a dummy array so firebase doesn't delete it
          if(newCard.sets.length === 0){
            newCard.sets = ['No recorded sets.']
          }
          if(newCard.identity.length === 0) {
            newCard.identity = ['Colorless']
          }
          //Pass the data to the function
          this.props.addNewCard(newCard, this.cardAdded);
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
  attemptQueryCardSuggestion = () => {
    if(this.state.newCard !== ''){
      if(this.state.suggestionTimeoutID !== undefined){
        clearTimeout(this.state.suggestionTimeoutID);
        const timeoutID = setTimeout(this.queryCardSuggestions, 300);
        this.setState({
          suggestionTimeoutID: timeoutID
        });
      }else{
        const timeoutID = setTimeout(this.queryCardSuggestions, 300);
        this.setState({
          suggestionTimeoutID: timeoutID
        });
      }
    }else{
      this.setState({
        possibleCards: []
      })
    }
  }
  queryCardSuggestions = () => {
    this.setState({
      suggestionTimeoutID: undefined
    });
    axios({
      method: 'GET',
      url: 'https://api.scryfall.com/cards/autocomplete',
      dataResponse: 'json',
      params: {
        q:this.state.newCard,
      }
    }).then( (result) => {
      if(result.data.data.length > 0){
        var limitedSuggestions = result.data.data.slice(0, 10);
        this.setState({
          possibleCards: limitedSuggestions
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
  takeCardSuggestion = (event) => {
    const suggestion = event.target.value;
    this.setState({
      newCard: suggestion,
      possibleCards: []
    })
  }
  cardAdded = () => {
    this.setState({
      newCard: '',
      possibleCards: [],
      newCardQuantity: 1
    });
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
      this.showTheUserAnError(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
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
  //Focus code found from
  //https://stackoverflow.com/questions/43145549/how-react-programmatically-focus-input
  focusOnCardInput = () => {
    this.textInput.current.focus();
  }
  render() {
    return(
      <div className="newCardDiv show">  
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
                    onChange={(e) => { this.setState({newCard:e.target.value}); this.attemptQueryCardSuggestion(); }} 
                    ref={this.textInput}
        	        />
                  {/* Underline span */}
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
                  {/* Underline span */}
                  <span></span>
        	        <button>Add Card</button>
        	      </form>
        	}
        </div>
    );
  }
};

export default NewCardForm;
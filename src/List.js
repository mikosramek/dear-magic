import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

import Card from './Card.js';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      newCard: '',
      newCardQuantity: 1,
      gettingCardDetails: false
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
      axios({
        method: 'GET',
        url: 'https://api.magicthegathering.io/v1/cards',
        dataResponse: 'json',
        params: {
          name:this.state.newCard,
          pageSize: 1
        }
      }).then( (result) => {
        console.log(result);
        this.addNewCard(result.data.cards[0]);
        this.setState({
          gettingCardDetails: false
        });
      }).catch( (error) => {
        
      });
      
    }else{
      //SCREAM AT THE USER
    }
  }

  addNewCard = (card) => {
    const newCard = {
      name: card.name,
      quantity: this.state.newCardQuantity,
      rarity: card.rarity,
      identity: card.colorIdentity,
      sets: card.printings,
      bought: false
    }
    console.log(newCard);
    const userCardsRef = firebase.database().ref(`${this.props.account}/cards`);
    userCardsRef.once('value', (data) => {
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

  render() {
    return(
      <div className="innerWrapper">
        <h3>Hi, {this.props.username}! Here is your list:</h3>
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
        <div className="newCardDiv">
        	{
        	  this.state.gettingCardDetails
        	    ? <p>Fetching card data</p>
        	    : <form onSubmit={this.queryNewCard} className="newCardForm">
              
        	        <label htmlFor="newCardName">Card name:</label>
        	        <input type="text" id="newCardName" 
        	          value={this.state.newCard} 
        	          onChange={(e) => this.setState({newCard:e.target.value})} 
        	        />
              
        	        <label htmlFor="newCardQuantity">How many:</label>
        	        <input type="number" id="newCardQuantity" 
        	          value={this.state.newCardQuantity} 
        	          onChange={(e) => this.setState({newCardQuantity:e.target.value})}
        	          min="1" max="1337"  
        	        />

        	        <button>Add Card</button>
        	      </form>
        	}
        </div>
        <button onClick={this.removeBoughtCards}>Archive Bought Cards</button>
        <button onClick={this.props.logoutCallback}>Log Out</button>
      </div>
    );
  }
};

export default List;
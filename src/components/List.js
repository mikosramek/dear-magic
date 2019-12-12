// import required modules
import React from 'react';
import firebase from '../firebase.js';

// import Components
import Card from './Card';
// import ErrorMessage from './ErrorMessage';
// import ConfirmationButton from './ConfirmationButton';

import ListInfo from './ListInfo';
import CardFilterForm from './CardFilterForm';
import NewCardForm from './NewCardForm';

import MenuItem from './MenuItem';


class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      filteredCards: [],
    }
    
  }
  componentDidMount() {
    const userRef = firebase.database().ref(this.props.account);
    userRef.on('value', (account) => {
      const cardArray = account.val().cards;
      if(cardArray !== undefined){
        this.setState({
          cards: cardArray,
          filteredCards: cardArray
        });
      }else{
        this.setState({
          cards: [],
          filteredCards: []
        })
      }
    });
  }

  addNewCard = (card, completeCallback) => {
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
    completeCallback();
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

  updateCardPrices = (newCardData, completeCallback) => {
    newCardData.forEach((card, index) => {
      if(card.data != null){
        const newPrice = card.data.prices;
        const cardsRef = firebase.database().ref(this.props.account).child(`cards/${index}`);
        cardsRef.once('value', (data) => {
          cardsRef.update({
            prices: newPrice,
            lastPriceCheck: new Date().toDateString()
          })
        });
      }
    });
    completeCallback();
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
  }

  filterCards = (event, setFilter, priceOrder) => {
    event.preventDefault();
    const currentCards = [...this.state.cards];
    let newCardArray = [];

    if(setFilter !== ''){
      newCardArray = currentCards.filter((card) => {
        if(card.sets.includes(setFilter.toLowerCase())){
          return true;
        }else{
          return false;
        }
      });
    }else {
      newCardArray = [...currentCards];
    }
    
    if(priceOrder !== 'none'){
      const noPriceCards = [];
      newCardArray.forEach((card) => {
        if(card.prices.usd === undefined){
          noPriceCards.push(card);
        }
      });
      noPriceCards.forEach((card) => {
        newCardArray.splice(newCardArray.indexOf(card), 1);
      });
      newCardArray.sort((a, b) => {
        const order = priceOrder;
        //if order is ASC return the higher one
        if(order === 'asc'){
          return parseFloat(a.prices.usd) < parseFloat(b.prices.usd) ? 1 : -1;
        }
        //if order is DESC return the lower one
        else if(order === 'desc'){
          return parseFloat(a.prices.usd) > parseFloat(b.prices.usd) ? 1 : -1;
        }
        return -1;
      })
    }

    this.setState({
      filteredCards: newCardArray
    })
  }  
  
  render() {
    return(
      <div className="innerWrapper">
        <h3>Hi, {this.props.username}! Here is your list:</h3>

        <ul className="menuItemList">
          <li className="">
            <MenuItem icon="fas fa-times" action="Add a card" position={0}>
               <NewCardForm addNewCard={this.addNewCard} />
            </MenuItem>
          </li>
          <li className="">
            <MenuItem icon="fas fa-receipt" action="Summary" position={1}>
              <ListInfo cards={this.state.cards}  updateCardPrices={this.updateCardPrices} removeBoughtCards={this.removeBoughtCards} removeAllCards={this.removeAllCards} />
            </MenuItem>
          </li>
          <li className="">
            <MenuItem icon="fas fa-filter" action="Filter your list" position={2}>
              <CardFilterForm filterCards={this.filterCards} />
            </MenuItem>
          </li>
        </ul>
        
        <button className="logoutButton" onClick={this.props.logoutCallback}>Log Out</button>
       


        {/* Start of Card List */}
        <ul className="cardList">
          {
            //Are there card and more than 0 cards?
            this.state.filteredCards !== undefined && this.state.filteredCards.length > 0
              //Map through them!
              ? this.state.filteredCards.map((item, index) => {
                return(
                  <Card key={index} checkOff={() => this.updateCardToBought(index)} card={item}/>
                )
              })
              //Show a placeholder message!
              : <li className="placeholderCard">Add cards by pressing the + button!</li>
          }
        </ul> {/* End of Card List */}
        
      </div> /* End of Inner Wrapper */
    );
  }
};

export default List;
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      newCard: '',
      newCardQuantity: 1
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

  addNewCard = (event) => {
    event.preventDefault();
    if(this.state.newCard !== ''){
      this.props.newCardCallback(this.state.newCard, this.state.newCardQuantity);
      this.setState({
        newCard: '',
        newCardQuantity: 1
      });
    }else{
      //SCREAM AT THE USER
    }
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

  render() {
    return(
      <main>
        <h3>Hi, {this.props.username}! Here are the cards you want:</h3>
        <ul className="cardList">
          {
            this.state.cards !== undefined && this.state.cards.length > 0
              ? this.state.cards.map((item, index) => {
                return(
                  <li key={index}>
                    <span onClick={() => this.updateCardToBought(index)}>{item.bought ? <span>Bought</span> : <span>Not bought</span>} {item.quantity}x {item.name}</span>
                  </li>
                )
              })
              : <li className="placeholderCard">Add cards by pressing the + icon!</li>
          }
        </ul>
        <form onSubmit={this.addNewCard}>

          <label htmlFor="newCardQuantity">How many:</label>
          <input type="number" id="newCardQuantity" 
            value={this.state.newCardQuantity} 
            onChange={(e) => this.setState({newCardQuantity:e.target.value})}
            min="1" max="1337"  
          />

          <label htmlFor="newCardName">Card name:</label>
          <input type="text" id="newCardName" 
            value={this.state.newCard} 
            onChange={(e) => this.setState({newCard:e.target.value})} 
          />

          <button>Add Card</button>
        </form>
        <button onClick={this.props.logoutCallback}>Log Out</button>
      </main>
    );
  }
};

export default List;
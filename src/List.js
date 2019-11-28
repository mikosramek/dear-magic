import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      cards:[],
      newCard: '',
      newCardQuantity: 1,
      isDescriptionShowing: false
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
          
      const newCard = {
        name: this.state.newCard,
        quantity: this.state.newCardQuantity,
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

  removeBoughtCards = () => {
    const cardsRef = firebase.database().ref(this.props.account).child(`cards`);
    const filteredCards = this.state.cards.filter((card) => {
      return !card.bought
    });
    cardsRef.set(filteredCards);
  }

  render() {
    return(
      <main>
        <div className="innerWrapper">
          <h3>Hi, {this.props.username}! Here are the cards you want:</h3>
          <ul className="cardList">
            {
              this.state.cards !== undefined && this.state.cards.length > 0
                ? this.state.cards.map((item, index) => {
                  return(
                    <li key={index}>
                      <span 
                        onClick={() => this.updateCardToBought(index)}
                        className = {item.bought ? 'bought' : ''}
                      >
                        {item.bought ? <i className='far fa-check-square'></i> : <i className='far fa-square'></i>} {item.quantity}x {item.name}
                      </span>
                      <button className="showDescriptionButton">
                        {
                          this.state.isDescriptionShowing 
                          ? <i className='fas fa-chevron-up'></i> 
                          : <i className='fas fa-chevron-down'></i>
                        }
                      </button>
                    </li>
                  )
                })
                : <li className="placeholderCard">Add cards by pressing the + icon!</li>
            }
          </ul>
          <form onSubmit={this.addNewCard} className="newCardFarm">
  
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
          <button onClick={this.removeBoughtCards}>Archive Bought Cards</button>
          <button onClick={this.props.logoutCallback}>Log Out</button>
        </div> {/* End of Wrapper */}
      </main>
    );
  }
};

export default List;
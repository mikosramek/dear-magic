import React from 'react';


//Get array of cards from List.js
  //An array passed down from props
//Go through every card
  //forEach
    //total quantity
    //prices
    //unique sets?
  //put these into state
//Collect the information, and put it in state
//Display the information

class ListInfo extends React.Component {
  getTotals = () => {
    const info = [];
    if(this.props.cards !== undefined){
      let tPrice = 0;
      let tQuantity = 0;
      this.props.cards.forEach((card) => {
        if(card.prices.usd !== undefined){
          tPrice += parseFloat(card.prices.usd) * card.quantity;
        }
        
        tQuantity += parseInt(card.quantity);
      });
      info.push({
        text: 'Total price: ',
        number: '$' + tPrice.toLocaleString() + ' USD'
      });
      info.push({
        text: 'Number of cards: ',
        number: tQuantity.toLocaleString()
      });
      return info;
    }
  }

  render() {
    return(
      <div className="listInfoPanel">
        {
          this.getTotals().map((info, index) => {
            return (
              <div key={'info' + index}>
                <h3>{info.text}</h3>
                <p>{info.number}</p>
              </div>
            )
          })
        }
      </div>
    );
  }
};

export default ListInfo;
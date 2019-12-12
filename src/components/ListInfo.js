import React from 'react';
import axios from 'axios';

import ConfirmationButton from './ConfirmationButton';
class ListInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      updatingPrices: false
    }
  }
  getTotals = () => {
    const info = [];
    if(this.props.cards !== undefined){
      let tPrice = 0;
      let tQuantity = 0;
      this.props.cards.forEach((card) => {
        //If the card has a price in usd, add it to the totals, if it doesn't, check if it does in foil.
        if(card.prices.usd !== undefined){
          tPrice += parseFloat(card.prices.usd) * card.quantity;
        }else if(card.prices.usd_foil !== undefined) {
          tPrice += parseFloat(card.prices.usd_foil) * card.quantity;
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
  queryCardPrices = () => {
    if(!this.state.updatingPrices) {
      this.setState({
        updatingPrices: true
      })
      const priceUpdates = [];
      this.props.cards.forEach( (card) => {
        const todaysDate = new Date();
        if(card.lastPriceCheck !== todaysDate.toDateString()){
          priceUpdates.push(
            axios({
              method: 'GET',
              url: 'https://api.scryfall.com/cards/named',
              dataResponse: 'json',
              params: {
                exact: card.name,
              },
              timeout: 10000,
            })
          );
        }else{
          //An empty promise -> from the Juno notes
          const myPromise = new Promise( (fulfill, reject) => {
            // here we say what will be returned from the promise if it is fulfilled
            fulfill('successful!')
            // here we say what will be returned from the promise if it is rejected
            reject('not successful!')
          })
          priceUpdates.push(
            myPromise
          )
        }
      });
      axios
        .all(priceUpdates)
        .then(
          axios.spread(
            (...results) => {
              this.props.updateCardPrices(results, this.pricesUpdated);
            }
          )
        ).catch((...errors) => {
          this.setState({
            updatingPrices: false
          })
        });
    }
  }
  pricesUpdated = () => {
    this.setState({
      updatingPrices: false
    })
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
        <button className="updatePricesButton" onClick={this.queryCardPrices} disabled={this.state.updatingPrices}>
          <i className={`fas fa-sync-alt ${this.state.updatingPrices ? 'updating' : ''}`} aria-label="Update card prices."></i>
        </button>
        <ConfirmationButton action="Clear Bought" confirmationMessage="Clear bought cards?" confirmAction={this.props.removeBoughtCards} />
        <ConfirmationButton action="Clear All" confirmationMessage="Clear all cards?" confirmAction={this.props.removeAllCards} />
      </div>
    );
  }
};

export default ListInfo;
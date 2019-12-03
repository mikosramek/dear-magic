import React from 'react';

import cardSets from './assets/sets.json';
import sparkle from './assets/2728_color.svg';


class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      expandDescription: false
    }
  }
  getColorIdentity = (colors) => {
    let identity = '';
    //A brute force thing to make sure the colour identity is in WUBRG order. (It's an MTG thing)
    if(colors.includes('W')){
      identity += 'W';
    }
    if(colors.includes('U')){
      identity += 'U';
    }
    if(colors.includes('B')){
      identity += 'B';
    }
    if(colors.includes('R')){
      identity += 'R';
    }
    if(colors.includes('G')){
      identity += 'G';
    }
    if(identity === ''){
      identity += 'Colorless'
    }
    return identity;
  }

  getPrice = (prices) => {
    const result = [];
    if(prices.usd !== undefined){
      result.push("$"+prices.usd+" USD");
    } else {
      result.push("No price info found.");
    }
    return result;
  }
  capitalizeWord = (word) => {
    let newWord = word.substring(0,1).toUpperCase() + word.substring(1, word.length);
    return newWord;
  }

  render() {
    const { bought, name, quantity, identity, rarity, sets, latestSet, prices, imgUrl, hasFoil } = this.props.card;
    return(
      <li>
        {/* Start of Card Header Div */}
        <div className="cardHeader">
        	<span 
        	  onClick={this.props.checkOff}
        	  className = {`${bought ? 'bought ' : ''}cardName`}
        	>
        	  <button>{bought ? <i className='far fa-check-square'></i> : <i className='far fa-square'></i>}</button> <span>{quantity}x {name}</span>
            <i className={`ss ss-${latestSet.toLowerCase()} ss-${rarity.toLowerCase()}`}></i>
        	</ span>
          
        	<button className="showDescriptionButton" onClick={() => this.setState({expandDescription: !this.state.expandDescription})}>
        	  <i className={`fas fa-chevron-${this.state.expandDescription ? 'up' : 'down'}`} aria-label={`Expand the description for ${name}`}></i>   
        	</ button>

        </div> {/* End of Card Header Div */}
        {/* Start of Card Body Div */}
        <div className={`cardBody ${this.state.expandDescription ? 'show' : 'hide'}`}>
          { 
            // Is there a foil version available?
            hasFoil
              // Display the sparkle!
              ? <div className="foilMark"><img src={sparkle} alt="This card has a foil version available."/></div>
              // Display nothing!
              : null
          }
          
          {/* Start of Card Details Div */}
          <div className="cardDetails">
            {/* Start of Card Image Div */}
            <div className="cardImage">
              <img src={imgUrl} alt={`The card for ${name}`}/>
            </div> {/* End of Card Image Div */}
            {/* Start of Card Text Div */}
            <div className="cardText">
              <p>Identity: 
                {
                  this.getColorIdentity(identity)
                }
              </p>
              <p>Rarity: {this.capitalizeWord(rarity)}</p>
              {
                this.getPrice(prices).map((item) => {
                  return <p key={item}>Price: {item}</p>
                })
              }
            </div> {/* End of Card Text Div */}
          </div> {/* End of Card Details Div */}
          {
            sets.map( (set) => {
              // return  <i key={name+set} className={`ss ss-${set.toLowerCase()} ss-${rarity.toLowerCase()}`}></i> 
              return (
              // Does the set exist in the card sets json
              (cardSets[set.toUpperCase()] !== undefined)
                // Display the set!
                ? <p key={name+set}><i className={`ss ss-${set} ss-${rarity}`}></i> {cardSets[set.toUpperCase()]}</p>
                // Display nothing! Shhhh!
                : null  
              )
            })
          }

        </div> {/* End of Card Body Div */}
      </li>
    );
  }
};

export default Card;
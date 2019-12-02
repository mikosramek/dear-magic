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
  componentDidMount() {
    
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
    // console.log(newWord);
    return newWord;
  }

  render() {
    // this.capitalizeWord('hello');
    const { bought, name, quantity, identity, rarity, sets, latestSet, prices, imgUrl, hasFoil } = this.props.card;
    // console.log(prices);
    return(
      <li>
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

        </div>
        <div className={`cardBody ${this.state.expandDescription ? 'show' : 'hide'}`}>
          { 
            hasFoil
              ? <div className="foilMark"><img src={sparkle} alt="This card has a foil version available."/></div>
              : null
          }
          
         
          <div className="cardDetails">
            <div className="cardImage">
              <img src={imgUrl} alt={`The card for ${name}`}/>
            </div>
            <div className="cardText">
              <p>
                {
                  this.getColorIdentity(identity)
                }
              </p>
              <p>{this.capitalizeWord(rarity)}</p>
              {
                this.getPrice(prices).map((item) => {
                  return <p key={item}>{item}</p>
                })
              }
            </div>
          </div>
          {
            sets.map( (set) => {
              // return  <i key={name+set} className={`ss ss-${set.toLowerCase()} ss-${rarity.toLowerCase()}`}></i> 
              return (
              (cardSets[set.toUpperCase()] !== undefined)
                ? <p key={name+set}><i className={`ss ss-${set} ss-${rarity}`}></i> {cardSets[set.toUpperCase()]}</p>
                : null  
              )
            })
          }

        </div>
      </li>
    );
  }
};

export default Card;
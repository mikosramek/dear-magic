import React from 'react';

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      expandDescription: false
    }
  }
  componentDidMount() {
    
  }
  render() {
    const { bought, name, quantity, identity, rarity, sets } = this.props.card;
    console.log(identity);
    console.log(rarity);
    console.log(sets);
    return(
      <li>
        <div className="cardHeader">
        	<span 
        	  onClick={this.props.checkOff}
        	  className = {bought ? 'bought' : ''}
        	>
        	  {bought ? <i className='far fa-check-square'></i> : <i className='far fa-square'></i>} {quantity}x {name}
        	</ span>
        
        	<button className="showDescriptionButton" onClick={() => this.setState({expandDescription: !this.state.expandDescription})}>
        	  <i className={`fas fa-chevron-${this.state.expandDescription ? 'up' : 'down'}`}></i>   
        	</ button>
        </div>
        <div className={`cardBody ${this.state.expandDescription ? 'show' : 'hide'}`}>
          <p>{rarity}</p>
          {
            identity.map((color) => {
              return <p>{color}</p>
            })
          }
          {
            sets.map((set) => {
              return  <i className={`ss ss-${set.toLowerCase()} ss-${rarity.toLowerCase()}`}></i> 
            })
          }

        </div>
      </li>
    );
  }
};

export default Card;
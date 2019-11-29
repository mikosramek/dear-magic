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

  getColorIdentity = (colors) => {
    let identity = '';
    // colors.forEach((item) => {
    //   identity += item;
    // });
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

  render() {
    const { bought, name, quantity, identity, rarity, sets } = this.props.card;
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
          <p>
            {
              sets.map((set) => {
                return  <i key={name+set} className={`ss ss-${set.toLowerCase()} ss-${rarity.toLowerCase()}`}></i> 
              })
            }
          </p>
          <p>
            {
              this.getColorIdentity(identity)
            }
          </p>
          <p>{rarity}</p>
          
          

        </div>
      </li>
    );
  }
};

export default Card;
import React from 'react';
// import files
import cardSets from '../assets/sets.json';
class CardFilterForm extends React.Component {
  constructor() {
    super();
    this.state= {
      possibleSets: [],
      isShowingNewCardForm: false,
      isShowingFilter: false,
      priceOrder: 'none',
      setFilter: ''
    }
  }
  toggleIsShowingFilter = () => {
    this.setState({
      isShowingFilter: !this.state.isShowingFilter
    });
  }
  getSetSuggestions = () => {
    const input = this.state.setFilter;
    if(input !== ''){
      const filter = new RegExp(input, "i");
      const pSets = [];
      for(let set in cardSets){
        if((filter.test(cardSets[set]) || filter.test(set)) && pSets.length < 10){
          pSets.push({abr: set, fullName: cardSets[set]});
        }
      }
      this.setState({
        possibleSets: pSets
      })
    }else{
      this.setState({
        possibleSets: []
      })
    }
  }
  takeSetSuggestion = (event) => {
    event.preventDefault();
    this.setState({
      possibleSets: [],
      setFilter: event.target.value
    });
  }
  render() {
    return(
      <>
        <div className={`cardFilterPanel show`}>
          <form onSubmit={(e) => this.props.filterCards(e, this.state.setFilter, this.state.priceOrder)}>
            <fieldset>
              <legend>Order by Price:</legend>
              <label htmlFor="priceNone" name="priceOrder">
                <input 
                  type="radio" 
                  name="priceOrder" 
                  id="priceNone" 
                  value="none"
                  checked={this.state.priceOrder === 'none'}
                  onChange={() => this.setState({priceOrder: 'none'})}
                />
                None
              </label>
              <label htmlFor="priceAsc" name="priceOrder">
                <input 
                  type="radio" 
                  name="priceOrder" 
                  id="priceAsc" 
                  value="asc" 
                  checked={this.state.priceOrder === 'asc'}
                  onChange={() => this.setState({priceOrder: 'asc'})}
                />
                High to Low
              </label>
              <label htmlFor="priceDesc" name="priceOrder">
                <input 
                  type="radio" 
                  name="priceOrder" 
                  id="priceDesc" 
                  value="desc" 
                  checked={this.state.priceOrder === 'desc'}
                  onChange={() => this.setState({priceOrder: 'desc'})}
                />
                Low to High
              </label>
            </fieldset>
            <label htmlFor="setFilter">Filter by Set:</label>
            <input type="text" autoComplete="off" id="setFilter" value={this.state.setFilter} onChange={ (e) => { this.setState({setFilter: e.target.value}, this.getSetSuggestions); } }/>
            {/* Underline span */}
            <span></span>
            {
              this.state.possibleSets.map((pCard, index) => {
                return <button value={pCard.abr} onClick={this.takeSetSuggestion} type="button" key={pCard.abr+index} className="setSuggestion" style={{top: `${138 + 37*index}px`}} >{pCard.abr}: {pCard.fullName}</button>
              })
            }
            <button>Apply filter</button>
          </form>
        </div>
      </>
    );
  }
};

export default CardFilterForm;
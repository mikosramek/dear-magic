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
        if((filter.test(cardSets[set]) || filter.test(set)) && pSets.length < 6){
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
            <label htmlFor="priceOrder">Order by Price:</label>
            <select name="priceOrder" id="priceOrder" onChange={(e) => this.setState({priceOrder: e.target.value})}>
              <option value="none">None</option>
              <option value="asc">High to Low</option>
              <option value="desc">Low to High</option>
            </select>
            <label htmlFor="setFilter">Filter by Set:</label>
            <input type="text" autoComplete="off" id="setFilter" value={this.state.setFilter} onChange={ (e) => { this.setState({setFilter: e.target.value}, this.getSetSuggestions); } }/>
            {/* Underline span */}
            <span></span>
            {
              this.state.possibleSets.map((pCard, index) => {
                return <button value={pCard.abr} onClick={this.takeSetSuggestion} type="button" key={pCard.abr+index} className="setSuggestion" style={{top: `${104 + 37*index}px`}} >{pCard.abr}: {pCard.fullName}</button>
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
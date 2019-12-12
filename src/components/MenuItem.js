import React from 'react';

class MenuItem extends React.Component {
  constructor() {
    super();
    this.state = {
      showContents: false
    }
  }
  componentDidMount() {
    
  }
  toggleShowContents = () => {
    this.setState({
      showContents: !this.state.showContents
    });
  }
  render() {
    return(
      <>
        <div className={`menuItemButton ${this.state.showContents ? 'show' : ''}`}>
          <button onClick={this.toggleShowContents}>
            {this.props.action}
          </button>
        </div>
        <div>
          <button onClick={this.toggleShowContents} className={`menuItemCloseButton ${this.state.showContents ? 'show' : ''}`}><i className='fas fa-times'></i></button>
          <div className={`menuItemBacking ${this.state.showContents ? 'show' : ''}`}>
          </div>
          <div className={`menuItemContent ${this.state.showContents ? 'show' : ''}`}>
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
};

export default MenuItem;
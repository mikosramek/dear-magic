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
            <i className={`fas ${this.props.icon}`} aria-label={this.props.action}></i>
          </button>
        </div>
        {
          this.state.showContents
          ? <div className="menuItemContent">
              {this.props.children}
            </div>
          : null
        }
        
      </>
    );
  }
};

export default MenuItem;
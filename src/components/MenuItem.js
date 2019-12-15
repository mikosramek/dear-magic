import React from 'react';

class MenuItem extends React.Component {
  constructor() {
    super();
    this.state = {
      showContents: false
    }
  }
  toggleShowContents = () => {
    this.setState({
      showContents: !this.state.showContents
    });
  }
  render() {
    return(
      <li className={`menuItem menuItem${this.props.position} ${this.state.showContents ? 'shift' : ''}`}>
        <button onClick={this.toggleShowContents} className={`menuItemButton ${this.state.showContents ? 'show' : ''}`}>
          <i className={this.props.icon} aria-label={this.props.action}></i>
        </button>
        <div>
          <div className={`menuItemBacking ${this.state.showContents ? 'show' : ''}`}>
          </div>
          <div className={`menuItemContent ${this.state.showContents ? 'show' : ''}`}>
            {this.props.children}
          </div>
        </div>
      </li>
    );
  }
};

export default MenuItem;
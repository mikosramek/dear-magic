import React from 'react';

import x from './assets/x.svg';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      input: ''
    }
  }
  componentDidMount() {
    console.log('swapped');
    this.setState({
      input: ""
    });
  }

  attemptAction = (event) => {
    event.preventDefault();
    if(this.state.input !== '') {
      this.setState({
        input: ""
      });
      this.props.callback(this.state.input);
    }else {
      //SCREAM AT USER
    }
  }



  render() {
    return(
      <main>
        <form onSubmit={this.attemptAction} className="userForm">
  
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={this.state.input} onChange={(event) => this.setState({input: event.target.value})}/>
          <img src={x} alt="An x indicating where to put your username." />
          <button>{this.props.action}</button>
          <span className="formDivider"></span>
          {
            this.props.children
          }
        </form>
      </main>
    );
  }
};

export default LoginForm;
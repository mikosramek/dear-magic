import React from 'react';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      showError: false
    }
  }
  componentDidMount() {
    this.setState({
      input: ''
    });
  }
  
  attemptAction = (event) => {
    event.preventDefault();
    const regex = / /mg;
    if(this.state.input !== '' && !regex.test(this.state.input)) {
      this.props.callback(this.state.input);
    }else {
      //SCREAM AT USER
      if(this.state.input === '') {
        this.props.showError("Please enter a username!");
      }else{
        this.props.showError("No spaces please!");
      }
    }
  }

  handleUserInput = (event) => {
    this.setState({
      input: event.target.value
    });
  }

  render() {
    return(
      <form onSubmit={this.attemptAction} className="userForm">
            
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={this.state.input} onChange={this.handleUserInput}/>
        {/* After element for underline */}
        <span></span>
        
        <button disabled={this.props.allowAction}>{this.props.action}</button>
        <span className="formDivider"></span>
        {
          this.props.children
        }
      </form>
    );
  }
};

export default LoginForm;
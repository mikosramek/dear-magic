import React from 'react';


class ErrorMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      showError: true,
      timeoutId: ''
    }
  }
  componentDidMount() {
    setTimeout(this.hideError, 1200);
  }
  hideError = () => {
    this.setState({
      showError: false
    });
    setTimeout(this.props.onEnd, 340);
  }
  render() {
    return(
      <div className={this.state.showError ? "userWarning" : "userWarning userWarningHidden"}>
        <p>{this.props.errorText}</p>
      </div>
    );
  }
};

export default ErrorMessage;
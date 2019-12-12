import React from 'react';


class ErrorMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      showError: true,
    }
  }
  //When the component mounts, set a timer until it fades out
  componentDidMount() {
    setTimeout(this.hideError, 1200);
  }
  //When it starts to fade out, start a timer until it unmounts itself with a callback
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
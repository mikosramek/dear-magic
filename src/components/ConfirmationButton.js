import React from 'react';

class ConfirmationButton extends React.Component {
  constructor() {
    super();
    this.state = {
      isConfirming: false,
    }
  }
  toggleIsConfirming = () => {
    this.setState({
      isConfirming: !this.state.isConfirming
    });
  }

  confirmAction = () => {
    this.props.confirmAction();
    this.toggleIsConfirming();
  }

  render() {
    return(
      <div className={`clearBoughtButton ${this.state.isConfirming ? 'clearBoughtConfirming' : ''}`}>
        {
          this.state.isConfirming 
            ? <>
                <p>{this.props.confirmationMessage}</p>
                <button onClick={this.confirmAction} className={`confirmClearButton ${this.state.isConfirming ? 'show' : ''}`}><i className="fas fa-check-circle" aria-label="Confirm clearing bought cards."></i></button>
                <button onClick={this.toggleIsConfirming}><i className="fas fa-times-circle" aria-label="Cancel clearing bought cards."></i></button>
              </>
            : <button onClick={this.toggleIsConfirming}>{this.props.action}</button>
        }
      </div>
    );
  }
};

export default ConfirmationButton;
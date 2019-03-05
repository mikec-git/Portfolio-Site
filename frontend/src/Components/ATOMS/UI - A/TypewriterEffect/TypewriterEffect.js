import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import c from './TypewriterEffect.module.scss';

class TypewriterEffect extends PureComponent {
  state = {
    text: ' '
  }

  componentDidMount() {
    this._isMounted = true;
    this.period = 2000;
  }

  componentDidUpdate(prevProps) {
    // Visible page is if page is contact...
    if(this.props.isVisible !== prevProps.isVisible) {
      this.timeoutId && clearTimeout(this.timeoutId);
      // Only runs if current page is contact page...
      if(this.props.isVisible) {
        this.txtType();
      } else {
        this.setState({ text: ' ' });
        this.isDeleting = false;
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
    this._isMounted = false;
  }

  txtType = () => {
    this.toRotate = this.props.words;
    this.loopNum = 0;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  // Main function controlling typewriter tick effect...
  tick = () => {
    // Rotates word index by one, starting from 0
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    // Deletes/adds char from end of current word...
    if(this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Sets updated word into state...
    if(this._isMounted) {
      this.setState({ text: this.txt });
    }

    let delta = 200 - Math.random() * 100;

    if(this.isDeleting) {
      delta /= 2;
    }

    // If word is in adding state and the text is at original state...
    if(!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
      // If word is blank and is in deleting stage...
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    this.timeoutId = setTimeout(this.tick, delta);
  };

  render() {
    let mainClasses = [c.TypewriterEffect];
    if(this.props.context === 'about') {
      mainClasses.push(c.TypewriterEffect_about)
    }

    return (
      <div className={mainClasses.join(' ')}>{this.state.text}</div>
    );    
  }
}

TypewriterEffect.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isVisible: PropTypes.bool.isRequired,
  context: PropTypes.string
}
 
export default TypewriterEffect;
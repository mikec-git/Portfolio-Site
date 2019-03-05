import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import c from './TitleSecondary.module.scss';

class TitleSecondary extends PureComponent {  
  state = {
    text: this.props.words ? this.props.words[0] : null
  }
  
  words = this.props.words;
  swapChars  = '!<>-_\\/[]{}—=+*^?#abcfhjkmqtuwxyz________%';
  counter    = 0;
  update     = this.update.bind(this);
  next       = this.next.bind(this);
  
  componentDidMount() {
    this._isMounted = true;
    
    if(this.props.context === 'landing') {
      this.next();
    } 
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.intervalId && clearInterval(this.intervalId);
    this.frameRequest && cancelAnimationFrame(this.frameRequest);
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps.animating !== this.props.animating) {
      // If route is animating... 
      if(this.props.animating) {
        this.intervalId && clearInterval(this.intervalId);
        this.frameRequest && cancelAnimationFrame(this.frameRequest);
      } 
      // Or is route is landing page...
      else if(this.props.context === 'landing') {
        this.next();
      }
    }
  }
  
  // Initiates next word to appear...
  next() {
    clearInterval(this.intervalId);
    // Calls setText with word associated with counter value...
    this.setText(this.words[this.counter]).then(() => {
      // Calls next word swap after 3s of resolving setText...
      this.intervalId = setInterval(this.next, 3000);
    });

    this.counter = (this.counter + 1) % this.words.length;
  }

  setText(newText) {
    cancelAnimationFrame(this.frameRequest);
    const oldText = this.state.text;
    const length  = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue    = [];
    
    // Iterates over length of longer word of current/prev words
    for (let i = 0; i < length; i++) {
      // Selects char from old/new text or empty string if none
      const from  = oldText[i] || '';
      const to    = newText[i] || '';

      // Increase start/end values to extend letter shuffle cycles
      const start = Math.floor(Math.random() * 45);
      const end   = start + Math.floor(Math.random() * 45);
      this.queue.push({ from, to, start, end });
    }

    // Call update (updates old word to new word)
    this.frame = 0;
    this.update();

    // Returns promise to call next word...
    return promise;
  }
  
  update() {
    let complete = 0;
    const output = [];

    for(let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      // If frame count is GTE end, set new letter to output...
      // This will only run once update() has been called this.frame times.
      // Once it does, it will start changing the old chars to the new word chars
      if(this.frame >= end) {
        complete++;
        output.push(<span key={i} className={c.TitleSecondary__Letter}>{to}</span>);
      } else if(this.frame >= start) {
        // Otherwise, choose a random char and add to output...
        if(!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output.push(<span key={i} className={c.TitleSecondary__Letter}>{char}</span>);
      } else {
        // Or keep the same letter until frame increases...
        output.push(<span key={i} className={c.TitleSecondary__Letter}>{from}</span>);
      }
    }

    this._isMounted && this.setState({ text: output });
    
    // If word update completed, resolve promise...
    if(complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.swapChars[Math.floor(Math.random() * this.swapChars.length)];
  }

  render() {
    const { context, isNotSeparate, text: propsText, words, elementRef } = this.props;
    let classesMain     = [c.TitleSecondary],
        classesLetters  = [c.TitleSecondary__Letters],
        text            = null;

    if(context === 'landing') {
      classesMain.push(c.TitleSecondary_landing);
      classesLetters.push(c.TitleSecondary__Letters_landing);
    } else if(context === 'about') {
      classesMain.push(c.TitleSecondary_about);
      classesLetters.push(c.TitleSecondary__Letters_about);
    } else if(context === 'contact') {
      classesMain.push(c.TitleSecondary_contact);
      classesLetters.push(c.TitleSecondary__Letters_contact);
    } 
    
    if(isNotSeparate) {
      text = <span>{propsText}</span>;
    } else if(propsText) {
      text = propsText.split('').map((letter, index) => {
        if(letter === ' ') {
          return <span key={index} className={c.TitleSecondary__Letter}>&nbsp;</span>
        }
        return <span key={index} className={c.TitleSecondary__Letter}>{letter}</span>;
      });
    } else {
      text = this._isMounted ? this.state.text : words[0];
    }
  
    return ( 
      <h2 className={classesMain.join(' ')}>
        <div ref={elementRef} className={classesLetters.join(' ')}>
          {text}
        </div>
      </h2>
      );
  }
}
 
TitleSecondary.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string),
  isNotSeparate: PropTypes.bool,
  animating: PropTypes.bool,
  context: PropTypes.string,
  text: PropTypes.string
}

export default TitleSecondary;
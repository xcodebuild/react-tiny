import 'babel-polyfill';
import './index.css';

import {createElement, render, Component} from '../../src/react-tiny.js';
const React = {};
React.Component = Component;
React.createElement = createElement;

class Click extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.setState({
            clicked: true,
        });
    }

    render() {
        return <input type="button" value={this.state.clicked ? 'I AM CLICKED': 'Click ME'} onClick={this.handleClick} />
    }
}

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', 
      todos: ['test', 'hehe'],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      text: e.target.value
    });
  }

  handleClick(e) {
    this.setState({
      ...this.state,
      todos: this.state.todos.concat([this.state.text]),
      text: '',
    });
  }

  remove(index) {
    this.setState({
      ...this.state,
      todos: this.state.todos.filter((value, i) => index !== i),
    });
  }

  render() {
    return <div>
        <div className="todo-container">
          <ul>
            {this.state.todos.map((item, index) => <li key={index}>
              {item}
             <button className="remove-btn" onClick={e => this.remove(index)}>REMOVE</button>
             </li>)}
          </ul>
          <input type="input" value={this.state.text} onInput={this.handleChange} />
          <button onClick={this.handleClick}>ADD#{this.state.todos.length}</button>
        </div>
        <div>
          <Click/>
        </div>
    </div>
  }
}

render(<Hello />, document.getElementById('container'));

import React, { Component } from 'react';
import update from 'react-addons-update';
import logo from './logo.svg';
import './App.css';
import liveFeedHub from './utils/liveFeedHub';
import { NotificationManager } from 'react-notifications';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			liveFeedData: []
		};
	}

	componentDidMount() {
    setTimeout(this.configureLivefeedHub.bind(this), 4000);
	}

	componentWillUnmount() {
		liveFeedHub.leaveGroup(1);
		clearInterval(this.testInterval);
		this.testInterval = null;
	}

  configureLivefeedHub() {
    liveFeedHub.joinGroup(1,
			(payload) => {
        console.log(payload);
				NotificationManager.success(payload.message, payload.fullName);
				this.setState((state) =>
					update(state, {
						liveFeedData: {
							$set:
							[payload].concat(state.liveFeedData)
						}
					})
				);
			}
		);

		// TODO: remove test data
		let liveFeedSampleData = [
			{
				"fullName": "Jack Smith",
				"message": "Just finished sample quiz with score: 80/100!"
			},
			{
				"fullName": "Sara Cruz",
				"message": "Just finished sample quiz with score: 60/100!"
			},
			{
				"fullName": "Adam Johnson",
				"message": "Just got 25 correct answers in a row!"
			},
			{
				"fullName": "Kelly Rodriguez",
				"message": "Just finished image puzzle with score: 100/100!"
			},
			{
				"fullName": "Rupak Pandi",
				"message": "Unlocked a free quiz key!"
			},
			{
				"fullName": "Zhen Fu",
				"message": "Just leveled up to Quiz Guru!"
			},
			{
				"fullName": "Pedram Amiri",
				"message": "Got the highest rank for group: Math 202015!"
			},
			{
				"fullName": "Ken Larson",
				"message": "Just leveled up to Quiz Master!"
			},
			{
				"fullName": "Angella De Rossi",
				"message": "Just got 10 correct answers in a row!"
			},
			{
				"fullName": "Sri Tanikkunath",
				"message": "Just leveled up to Quiz Master!"
			}
		];

		this.testInterval = setInterval(() => liveFeedHub.broadcastGroup(1,
		liveFeedSampleData[Math.floor(Math.random() * (9 - 0 + 1) + 0)]), 8000);
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
					<h3 className="App-sub-header">Live Feed hub with SignalR</h3>
        </div>
        <p className="App-intro">
          To test the Live Feed hub, navigate to this page from two different browsers.
					Open developer tools > console to see the messages being exchanged between
					two clients.
        </p>
      </div>
    );
  }
}

export default App;

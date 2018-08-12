// https://github.com/dfrencham/ms-signalr-client/issues/2
import { appConstants } from './appConstants';
import $ from 'jquery';
window.jQuery = $;
require('ms-signalr-client');

class liveFeedHub {
	constructor() {
		this.proxy = {};
		this.connectionId = null;
		this.onLiveFeedUpdated = null;
		this.lastGroupIdJoined = null;
	}

	startHub() {

		// [NOTE]: In case you want to authenticate Livefeed requests, 
		//         obtain the token and pass it as a query string parameter.

		//const token = getAccessToken(...);
		//if (!token) {
		//	console.log('Not authenticated; Cannot connect to LiveFeed hub!');
		//	return;
		//}

		// const hubEndpoint = 'http://localhost:52202/signalr';
		const hubEndpoint = 'http://localhost:2558/signalr';
		const connection = $.hubConnection(hubEndpoint, {
			useDefaultPath: false
		//	qs: `Bearer=${token}`
		});
		const proxy = connection.createHubProxy('chatHub');

		connection.connectionSlow(() =>
			console.log('Currently experiencing difficulties with the connection to LiveFeed hub!')
		);

		connection.disconnected(() => {
			console.log(`LiveFeed hub got disconnected! Trying to reconnect in ${appConstants.LIVEFEEDHUB_RECONNECT_TIME_WINDOW} ms...!`);
			
			this.connectionId = null;
			setTimeout(() => {
			 	this.tryConnect();
			}, appConstants.LIVEFEEDHUB_RECONNECT_TIME_WINDOW); // Restart connection after few seconds.
		});

		// receives broadcast messages from a hub function, called "onBroadcastGroup"
		proxy.on('onBroadcastGroup', (payload) => this.onLiveFeedUpdated && this.onLiveFeedUpdated(payload));
		proxy.on('broadCastMessage',(name,msg)=>console.log('name:'+name+' msg:'+msg))
		this.connection = connection;
		this.proxy = proxy;
		this.tryConnect();
	}

	tryConnect() {
		const _this = this;
		// attempt connection, and handle errors
		this.connection.start()
			.done(() => {
				console.log(`LiveFeed hub connected, Connection Id: ${_this.connection.id}`);

				_this.proxy = this.connection.createHubProxy('chatHub');
				_this.connectionId = _this.connection.id;
				if (this.lastGroupIdJoined) {
					console.log(`Re-joining to Group Id ${this.lastGroupIdJoined} after disconnect!`);
					
					this.joinGroup(this.lastGroupIdJoined, this.onLiveFeedUpdated);
				}
			})
			.fail((err) => {
				console.log(`LiveFeed connection failed! Error details: ${err}`);

				_this.proxy = {};
				_this.connectionId = null;
			});
	}

	joinGroup(groupId, onLiveFeedUpdated) {
		if (this.connectionId) {
			if (onLiveFeedUpdated) {
				this.onLiveFeedUpdated = onLiveFeedUpdated;
			}
			this.proxy.invoke('joinGroup', groupId);
			this.lastGroupIdJoined = groupId;
			console.log(`Joined Group Id: ${groupId}`);
		}
	}

	leaveGroup(groupId) {
		if (this.connectionId) {
			this.onLiveFeedUpdated = null;
			this.proxy.invoke('leaveGroup', groupId);
			this.lastGroupIdJoined = null;
			console.log(`Left Group Id: ${groupId}`);
		}
		
	}

	broadcastGroup(groupId, payload) {
		console.log('Broadcasting...');
		if (this.connectionId) {
			this.proxy.invoke('broadcastGroup', groupId, payload);
			console.log('Broadcasted!');
		}
		this.sendMsg('tt','hi');
	}

	sendMsg(name,msg){
		console.log('sendMsg');
		if(this.connectionId){
			this.proxy.invoke('SendMessage',name,msg);
			console.log('sendmsg');
		}
	}
}

export default (new liveFeedHub());

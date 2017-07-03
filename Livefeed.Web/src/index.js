import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import liveFeedHub from './utils/liveFeedHub';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

liveFeedHub.startHub();
ReactDOM.render(
  <div>
    <App />
    <NotificationContainer/>
  </div>, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';

const root = document.getElementById('root');
if (!root) throw new Error('Root not found');
ReactDOM.render(<App />, root);

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => ReactDOM.unmountComponentAtNode(root));
}

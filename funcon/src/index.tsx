import React from 'react';
import ReactDOM from 'react-dom';
import { start } from './chart';
import { App } from './components/app';
import { percentageFirstSpeaker, percentageSecondSpeaker } from './text-analysis';

const root = document.getElementById('root');
if (!root) throw new Error('Root not found');
ReactDOM.render(<App />, root);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
  // @ts-ignore
  module.hot.dispose(() => ReactDOM.unmountComponentAtNode(root));
}
document.addEventListener('DOMContentLoaded', () => {
  console.log('start stuff...');
  start(percentageFirstSpeaker, percentageSecondSpeaker);
});

import React from 'react';
import classes from './App.module.scss';
import { APP_STAGE } from './constants/environment';

if (APP_STAGE === 'local') {
  require('./mocks');
}

function App() {
  return (
    <div className={classes.app}>
      <span className="m-5 text-blue-500 font-bold">text</span>
    </div>
  );
}

export default App;

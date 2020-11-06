import React from 'react';
import { FrontendContextProvider } from 'context/FrontendContext';
import ImageSelection from 'components/ImageSelection';
import 'assets/scss/frontend.scss';

const App = () => {
  return (
    <FrontendContextProvider>
      <ImageSelection />
    </FrontendContextProvider>
  );
};

export default App;

import React from 'react';

import { Provider as StoreProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import store from './src/store';
import MyApp from './src/containers/App';
import { NativeRouter } from 'react-router-native';


const theme = {
  ...DefaultTheme,
  // roundness: 2,
  // colors: {
  //   ...DefaultTheme.colors,
  //   primary: '#4f4f4a',
  //   secondary: '#dce319',
  //   accent: '#dce319',
  // },
};


const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NativeRouter>
          <MyApp />
        </NativeRouter>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;

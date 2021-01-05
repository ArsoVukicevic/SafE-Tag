import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import { Provider } from 'react-redux'
import 'babel-polyfill'

import {
  BrowserRouter as Router
} from 'react-router-dom'
import './index.css'
import store from './store'

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </ Router >
    </Provider >,
    document.getElementById('root')
  )
})

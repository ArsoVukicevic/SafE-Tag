import React from 'react'
// reactstrap components
import {
  Alert
} from 'reactstrap'
const AlertElement = ({ msg, level = 'danger' }) => {
  return (
    <Alert color={level} style={{ marginTop: 10 }}>
      {msg}
    </Alert>
  )
}

export default AlertElement

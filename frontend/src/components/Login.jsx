
import React from 'react'

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from 'reactstrap'
import AlertElement from './AlertElement'

class Login extends React.Component {
  constructor(props) {
    super(props)
    // @TODO REMOVE
    this.state = { pass: '', email: '' }

    this.handleSignIn = this.handleSignIn.bind(this)

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePassChange = this.handlePassChange.bind(this)
  }

  handleSignIn(event) {
    this.props.containerProps.loginAction({ pass: this.state.pass, email: this.state.email })
    event.preventDefault()
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  handlePassChange(event) {
    this.setState({ pass: event.target.value })
  }

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              {this.props.containerProps.selectloginErrorMsg != null
                ? <AlertElement msg={this.props.containerProps.selectloginErrorMsg} />
                : null}
              <div className="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" value={this.state.email} onChange={this.handleEmailChange} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" name='pass' type="password" value={this.state.pass} onChange={this.handlePassChange} />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={this.handleSignIn}>
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          {/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
        </Col>
      </>
    )
  }
}

export default Login

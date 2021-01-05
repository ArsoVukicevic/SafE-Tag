import React from 'react'
import { connect } from 'react-redux'

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CardBody
} from 'reactstrap'

import ROLES from '../../types/Roles.js'
import { selectUser } from '../Auth/selectors.js'
import { selectInsertUserViewData } from '../App/selectors.js'
import { insertUserAction } from '../Admin/reducer.js'
import { insertUserViewAction } from '../App/reducer.js'
import { selectErrorMsg, selectRequestSuccess } from '../Admin/selectors.js'
import AlertElement from '../../components/AlertElement.js'

const actionsToProps = dispatch => ({
  insertUser: (payload) => dispatch(insertUserAction(payload)),
  insertUserViewAction: (payload) => dispatch(insertUserViewAction(payload))
})

const stateToProps = state => ({
  viewData: selectInsertUserViewData(state),
  user: selectUser(state),
  errMsg: selectErrorMsg(state),
  insertSuccess: selectRequestSuccess(state)
})
class InsertUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      insertUserPass: '',
      insertUserEmail: '',
      workingPlace: '',
      roleId: '',
      name: '',
      lastname: '',
      phone: '',
      factoryId: ''
    }

    this.submit = false
    this.handleSignIn = this.handleSignIn.bind(this)

    this.handleChange = this.handleChange.bind(this)
  }

  handleSignIn(event) {
    this.submit = true
    this.props.insertUser(this.state)
    event.preventDefault()
  }

  handleChange(event) {
    console.log('Handle change', event.target.id)
    this.setState({ [event.target.id]: event.target.value })
  }

  renderFormFactory(factories) {
    return (
      <FormGroup>
        <Label for="factoryId">Factory</Label>
        <Input value={this.state.factoryId} type="select" id="factoryId" onChange={this.handleChange}>
          {factories.map(f => <option key={f.id} value={f.id} >{f.name}</option>)}
        </Input>
      </FormGroup>
    )
  }

  renderFormRole(roles) {
    return (
      <FormGroup>
        <Label for="roleId">SafE-Tag Role</Label>
        <Input value={this.state.roleId} type="select" id="roleId" onChange={this.handleChange}>
          {roles.map(r => <option key={r.id} value={r.id} >{r.name}</option>)}
        </Input>
      </FormGroup>
    )
  }

  renderForm() {
    console.log('InsertUser Render/ReRender')

    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="insertUserEmail">Email</Label>
              <Input type="email" id="insertUserEmail" autoComplete="off" placeholder="jesse@example.com" value={this.state.email} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="insertUserPass">Password</Label>
              <Input type="password" id="insertUserPass" autoComplete="off" value={this.state.pass} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="workingPlace">Workplace and position</Label>
          <Input type="text" id="workingPlace" autoComplete="off" placeholder="Apartment, studio, or floor"
            value={this.state.workingPlace} onChange={this.handleChange}
          />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="name">First name</Label>
              <Input type="text" id="name" autoComplete="off" value={this.state.name} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="lastname">Last name</Label>
              <Input type="text" id="lastname" autoComplete="off" value={this.state.lastname} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input type="text" id="phone" autoComplete="off" value={this.state.phone} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          {
            this.props.user.role === ROLES.OWNER
              ? <Col md={4}>
                {this.props.viewData !== null ? this.renderFormFactory(this.props.viewData.factories) : null}
              </Col>
              : null
          }
          <Col md={4}>
            {this.props.viewData !== null ? this.renderFormRole(this.props.viewData.roles) : null}
          </Col>
        </Row>
        <Button onClick={this.handleSignIn} color="primary">Submit</Button>
      </Form>
    )
  }

  componentDidMount() {
    console.log('InsertUser componentDidMount')
    if (this.props.viewData != null) {
      this.setState({ roleId: this.props.viewData.roles[0].id })
      if (this.props.user.role === ROLES.OWNER) {
        this.props.viewData.factories[0] &&
        this.setState({ factoryId: this.props.viewData.factories[0].id })
      }
    } else {
      this.props.insertUserViewAction()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.viewData == null && prevProps.viewData !== this.props.viewData) {
      this.setState({ roleId: this.props.viewData.roles[0].id })
      if (this.props.user.role === ROLES.OWNER) {
        this.props.viewData.factories[0] &&
        this.setState({ factoryId: this.props.viewData.factories[0].id })
      }
    }

    if (this.props.insertSuccess && prevProps.insertSuccess !== this.props.insertSuccess) {
      this.setState({
        insertUserPass: '',
        insertUserEmail: '',
        workingPlace: '',
        name: '',
        lastname: '',
        phone: '',
        factoryId: this.props.user.role === ROLES.OWNER ? this.props.viewData.factories[0].id : '',
        roleId: this.props.viewData.roles[0].id
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* Header blue Gradient */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />

        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Insert user data</h3>
                  {
                    this.submit === true
                      ? this.props.errMsg != null
                        ? <AlertElement msg={this.props.errMsg} />
                        : null
                      : null
                  }

                  {
                    this.submit === true
                      ? this.props.insertSuccess !== false
                        ? <AlertElement msg={'User successfully inserted!'} level={'info'} />
                        : null
                      : null
                  }
                </CardHeader>

                <CardBody>
                  {this.renderForm()}
                </CardBody>

              </Card>
            </div>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default connect(stateToProps, actionsToProps)(InsertUser)

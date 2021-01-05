
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
import { selectInsertUserViewData } from '../App/selectors.js'
import { selectUser } from '../Auth/selectors.js'
import { selectErrorMsg, selectRequestSuccess } from '../Admin/selectors.js'
import { updateUserAction } from '../Admin/reducer.js'
import { insertUserViewAction } from '../App/reducer.js'
import AlertElement from '../../components/AlertElement.js'

const actionsToProps = dispatch => ({
  updateUserAction: (payload) => dispatch(updateUserAction(payload)),
  insertUserViewAction: (payload) => dispatch(insertUserViewAction(payload))

})

const stateToProps = state => ({
  viewData: selectInsertUserViewData(state),
  user: selectUser(state),
  errMsg: selectErrorMsg(state),
  updateSuccess: selectRequestSuccess(state)
})

class EditUser extends React.Component {
  constructor(props) {
    super(props)

    const user = props.location.userForEdit
    if (!user) {
      props.history.push('/admin')

      this.state = {
      }
      return
    }
    this.state = {
      userId: user.id,
      pass: '',
      email: user.email,
      workingPlace: user.workingPlace,
      roleId: user.roleId,
      roleName: user.role, // Used when update state tableOfUsers
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      isActive: user.isActive,
      factoryId: user.factory.id,
      factoryName: user.factory.name // Used when update state tableOfUsers
    }

    this.submit = false
    this.handleSubmit = this.handleSubmit.bind(this)

    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    this.submit = true

    this.props.updateUserAction(this.state)
    event.preventDefault()
  }

  handleChange(event) {
    if (event.target.id === 'factoryId') {
      const index = event.nativeEvent.target.selectedIndex
      const text = event.nativeEvent.target[index].text
      this.setState({ [event.target.id]: event.target.value, factoryName: text })
    } else if (event.target.id === 'roleId') {
      const index = event.nativeEvent.target.selectedIndex
      const text = event.nativeEvent.target[index].text
      this.setState({ [event.target.id]: event.target.value, roleName: text })
    } else if (event.target.id === 'isActive') {
      this.setState({ [event.target.id]: event.target.checked })
    } else {
      this.setState({ [event.target.id]: event.target.value })
    }
  }

  renderFormFactory(factories) {
    return (
      <FormGroup>
        <Label for="factoryId">Factory</Label>
        {console.log('renderFormFactory', this.state.factoryId)}
        <Input value={this.state.factoryId} type="select" id="factoryId" onChange={this.handleChange}>
          {factories.map(f => {
            return <option key={f.id} value={f.id} >{f.name}</option>
          })
          }
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
    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" placeholder="email placeholder" value={this.state.email} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="pass">Password</Label>
              <Input type="password" id="pass" placeholder="password placeholder" value={this.state.pass} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="workingPlace">Workplace and position</Label>
          <Input type="text" id="workingPlace" placeholder="Apartment, studio, or floor" value={this.state.workingPlace} onChange={this.handleChange} />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="name">First name</Label>
              <Input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="lastname">Lastname</Label>
              <Input type="text" id="lastname" value={this.state.lastname} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input type="text" id="phone" value={this.state.phone} onChange={this.handleChange} />
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
          <Col md={4}>
            <FormGroup>
              <div className="mt-4 mt-md-0">
                <div className="mb-3">
                  <Label for="isActive">Is active</Label>
                </div>
                <label className="custom-toggle">
                  <input type="checkbox" id='isActive' checked={this.state.isActive} onChange={this.handleChange}/>
                  <span className="custom-toggle-slider rounded-circle">
                  </span>
                </label>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Button onClick={this.handleSubmit}>Submit</Button>
      </Form>
    )
  }

  componentDidMount() {
    console.log('EditUser componentDidMount')
    if (this.props.viewData == null) {
      this.props.insertUserViewAction()
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
                  <h3 className="mb-0">Change user data</h3>
                  {
                    this.submit === true
                      ? this.props.errMsg != null
                        ? <AlertElement msg={this.props.errMsg} />
                        : null
                      : null
                  }

                  {
                    this.submit === true
                      ? this.props.updateSuccess !== false
                        ? <AlertElement msg={'User successfully updated!'} level={'info'} />
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

export default connect(stateToProps, actionsToProps)(EditUser)

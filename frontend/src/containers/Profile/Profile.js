import React from 'react'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from 'reactstrap'
// core components
import ProfileHeader from './ProfileHeader'
import AlertElement from '../../components/AlertElement'

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      name: '',
      address: '',
      phone: '',
      info: '',
      editMode: false
    }

    this.submit = false

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    if (this.state.editMode) {
      this.submit = true
      this.props.updateFactoryAction(this.state)
      this.setState({
        editMode: false
      })
      event.preventDefault()
    } else {
      this.setState({
        editMode: true
      })
    }
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })
  }

  componentDidMount() {
    if (this.props.factoryInfo == null) {
      this.props.getFactoryAction()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.factoryInfo !== prevProps.factoryInfo) {
      this.setState({
        id: this.props.factoryInfo.id,
        name: this.props.factoryInfo.name,
        address: this.props.factoryInfo.address,
        phone: this.props.factoryInfo.phone,
        info: this.props.factoryInfo.info,
        licencePaid: this.props.factoryInfo.licencePaid
      })
    }
  }

  render() {
    return (
      <>
        <ProfileHeader user={this.props.user}/>
        {/* Page content */}
        <Container className="mt--9" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <h1 className="text-muted text-center">
                    {this.state.name}
                  </h1>
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
                        ? <AlertElement msg={'Factory successfully updated!'} level={'info'} />
                        : null
                      : null
                  }
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h6 className="heading-small text-muted mb-4">
                      Factory information
                        </h6>
                      </Col>
                      <Col className="text-right" xs="4">
                        <Button
                          color="info"
                          href="#pablo"
                          onClick={this.handleSubmit}
                        >
                          {this.state.editMode ? 'Submit' : 'Edit'}
                        </Button>
                      </Col>
                    </Row>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="name"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="name"
                              placeholder="Username"
                              type="text"
                              value={this.state.name}
                              onChange={this.handleChange}
                              disabled={!this.state.editMode}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="address"
                              placeholder="jesse@example.com"
                              type="text"
                              value={this.state.address}
                              onChange={this.handleChange}
                              disabled={!this.state.editMode}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="phone"
                            >
                              Phone
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="phone"
                              placeholder="First name"
                              type="text"
                              value={this.state.phone}
                              onChange={this.handleChange}
                              disabled={!this.state.editMode}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                              style={{ width: '100%' }}
                            >
                              Paid
                            </label>
                            <button className="form-control-alternative btn btn-icon btn-2 btn-primary" type="text">
                              <span className="btn-inner--icon">
                                <i className={this.state.licencePaid ? 'ni ni-check-bold' : 'ni ni-fat-delete'}></i>
                              </span>
                            </button>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">About Factory</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>About Factory</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="A few words about factory ..."
                          rows="4"
                          id="info"
                          type="textarea"
                          value={this.state.info}
                          onChange={this.handleChange}
                          disabled={!this.state.editMode}
                        />
                      </FormGroup>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default Profile

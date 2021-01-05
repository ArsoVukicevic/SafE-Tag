
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
import { updateFactoryAction } from '../Admin/reducer'
import { selectErrorMsg, selectRequestSuccess } from '../Admin/selectors'
import AlertElement from '../../components/AlertElement'

const actionsToProps = dispatch => ({
  updateAction: (payload) => dispatch(updateFactoryAction(payload))

})

const stateToProps = state => ({
  // Error handling
  errMsg: selectErrorMsg(state),
  updateSuccess: selectRequestSuccess(state)
})

class EditFactory extends React.Component {
  constructor(props) {
    super(props)

    const factory = props.location.factoryForEdit
    if (!factory) {
      props.history.push('/admin/factory-table')

      this.state = {
      }
      return
    }
    this.state = {
      id: factory.id,
      name: factory.name,
      address: factory.address,
      phone: factory.phone == null ? '' : factory.phone,
      info: factory.info == null ? '' : factory.info,
      licencePaid: factory.licencePaid
    }

    this.submit = false
    this.handleSubmit = this.handleSubmit.bind(this)

    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    console.log('HandleSubmit state', this.state)
    this.submit = true
    this.props.updateAction(this.state)
    event.preventDefault()
  }

  handleChange(event) {
    let value = null
    if (event.target.id === 'licencePaid') {
      value = event.target.checked
    } else {
      value = event.target.value
    }

    this.setState({ [event.target.id]: value })
  }

  renderForm() {
    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input type="text" id="address" value={this.state.address} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="info">Info</Label>
          <Input type="text" id="info" value={this.state.info} onChange={this.handleChange} />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="name">Phone</Label>
              <Input type="text" id="phone" value={this.state.phone} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <div className="mt-4 mt-md-0 col-sm-6 col-lg-3">
                <div className="mb-3">
                  <Label for="licencePaid">Licence Paid</Label>
                </div>
                <label className="custom-toggle">
                  <input type="checkbox" id='licencePaid' checked={this.state.licencePaid === true} onChange={this.handleChange}/>
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
                  <h3 className="mb-0">Change factory data</h3>
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

export default connect(stateToProps, actionsToProps)(EditFactory)

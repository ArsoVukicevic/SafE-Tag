import React from 'react'
import { Form, Row, Col, FormGroup, Label, Input, Button, Container, CardBody, CardHeader, Card } from 'reactstrap'
import AlertElement from '../../components/AlertElement'

class EditItems extends React.Component {
  constructor(props) {
    super(props)

    this.item = props.location.item
    this.state = {
      id: this.parseKeyInID(this.item.id),
      name: this.item.name,
      source: this.item.source,
      desc: this.item.desc,
      isActive: this.item.isActive,
      image: this.item.image,
      imageAsDataURL: null
    }

    this.submit = false
    this.handleChange = this.handleChange.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loadImgFromSrc = this.loadImgFromSrc.bind(this)
  }

  parseKeyInID(key) {
    const keys = key.split('/')

    return keys[keys.length - 1]
  }

  handleChange(event) {
    if (event.target.id === 'isActive') {
      this.setState({ [event.target.id]: event.target.checked })
    } else {
      this.setState({ [event.target.id]: event.target.value })
    }
  }

  handleImageUpload(event) {
    const value = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      this.setState({
        imageAsDataURL: e.target.result
      })
    }

    reader.readAsDataURL(value)
  }

  loadImgFromSrc() {
    if (this.state.imageAsDataURL) {
      return this.state.imageAsDataURL
    } else {
      return `/images/${this.state.image}`
    }
  }

  handleSubmit(event) {
    this.submit = true
    const request = { id: this.state.id, name: null, desc: null, source: this.state.source, isActive: null, imageAsDataURL: null }
    if (this.item.name !== this.state.name) {
      request.name = this.state.name
    }
    if (this.item.desc !== this.state.desc) {
      request.desc = this.state.desc
    }

    if (this.item.isActive !== this.state.isActive) {
      request.isActive = this.state.isActive
    }
    if (this.state.imageAsDataURL !== null) {
      request.imageAsDataURL = this.state.imageAsDataURL
    }
    this.props.updateItemAction(request)
    event.preventDefault()
  }

  render() {
    return (
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">

              <CardHeader className="border-0">
                <h3 className="mb-0">Change item data</h3>
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
                      ? <AlertElement msg={'Item successfully updated!'} level={ 'info'} />
                      : null
                    : null
                }
              </CardHeader>

              <CardBody>
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
                        <Label for="desc">Descriprion</Label>
                        <Input type="text" id="desc" value={this.state.desc} onChange={this.handleChange} />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
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
                    <Col md={6}>
                      <div >
                        <img
                          style={{ width: 250, height: 200 }}
                          alt="..."
                          src={this.loadImgFromSrc()}
                        />
                      </div>
                      <Input type="file" id="image" onChange={this.handleImageUpload}/>
                    </Col>
                  </Row>
                  <Button onClick={this.handleSubmit}>Submit</Button>
                </Form>
              </CardBody>

            </Card>
          </div>
        </Row>
      </Container>
    )
  }
}

export default EditItems

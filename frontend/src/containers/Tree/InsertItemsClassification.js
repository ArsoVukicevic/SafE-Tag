
import React from 'react'

import { CLASSIFICATION } from '../../types/Classification.js'
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
  CardBody,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

import AutoComplite from '../../components/AutoComplite.js'
import AlertElement from '../../components/AlertElement.js'

const nu = {
  parentId: '',
  name: '',
  desc: ''
}
const np = {
  parentId: '',
  name: '',
  desc: ''
}
const nm = {
  parentId: '',
  name: '',
  desc: ''
}
const item = {
  parentId: '',
  image: '',
  imageAsDataURL: '',
  codeDesc: '',
  desc: ''
}

const dropDownState = [
  { id: CLASSIFICATION.NU.id, name: CLASSIFICATION.NU.name },
  { id: CLASSIFICATION.NP.id, name: CLASSIFICATION.NP.name },
  { id: CLASSIFICATION.NM.id, name: CLASSIFICATION.NM.name },
  { id: -100, name: 'ITEM' }
]

class InsertItemsClassification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropDownItemSelected: dropDownState[0],
      NU: nu,
      NP: np,
      NM: nm,
      ITEM: item
    }

    this.submit = false
    this.handleSubmit = this.handleSubmit.bind(this)

    this.handleDropDownClick = this.handleDropDownClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleAutoCompliteSelected = this.handleAutoCompliteSelected.bind(this)
  }

  handleSubmit(event) {
    this.submit = true
    const requestData = this.state[this.state.dropDownItemSelected.name]
    requestData.typeId = this.state.dropDownItemSelected.id
    if (this.state.dropDownItemSelected.id == -100) {
      this.props.insertItem(requestData)
    } else {
      this.props.insertClassification(this.state[this.state.dropDownItemSelected.name])
    }
    event.preventDefault()
  }

  handleDropDownClick(event) {
    // Start, Clear parent id after user change item on drop down
    // dropDownName can have value of NU/NP...
    const dropDownName = this.state.dropDownItemSelected.name
    const x = this.state[dropDownName]
    x.parentId = ''
    // END
    this.submit = false
    this.setState({
      dropDownItemSelected: { id: event.target.id, name: event.target.textContent },
      [dropDownName]: x
    })
    event.preventDefault()
  }

  handleChange(event) {
    // name can have value of NU/NP...
    const name = this.state.dropDownItemSelected.name

    const value = event.target.value

    const x = this.state[name]
    x[event.target.id] = value

    this.setState({ [name]: x })
    event.preventDefault()
  }

  handleImageUpload(event) {
    const value = event.target.files[0]
    const x = this.state.ITEM
    x.image = value
    const reader = new FileReader()
    reader.onload = (e) => {
      x.imageAsDataURL = e.target.result
      this.setState({
        ITEM: x
      })
    }

    reader.readAsDataURL(value)

    this.setState({ ITEM: x })
  }

  handleAutoCompliteSelected({ id }) {
    // name can have value of NU/NP...
    const dropDownName = this.state.dropDownItemSelected.name
    const x = this.state[dropDownName]
    x.parentId = id

    this.setState({ [dropDownName]: x })
  }

  renderClassificationForm(data) {
    const autoCompliteData = this.props.classificationAndItems.classifications[this.state.dropDownItemSelected.id]
    console.log('RenderClassificationForm', autoCompliteData)
    return (

      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" id="name" autoComplete="off" value={data.name} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="parentId">Parent</Label>
              <AutoComplite datas = {autoCompliteData} onSelected = {this.handleAutoCompliteSelected} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="desc">Description</Label>
          <Input type="text" id="desc" value={data.desc} autoComplete="off" onChange={this.handleChange} />
        </FormGroup>

        <Button onClick={this.handleSubmit} color="primary">Submit</Button>
      </Form>
    )
  }

  renderItemForm(data) {
    const autoCompliteData = this.props.classificationAndItems.items
    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="codeDesc">Identification number</Label>
              <Input type="text" id="codeDesc" autoComplete="off" value={data.codeDesc} onChange={this.handleChange} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>

              <Label for="parentId">Parent</Label>
              <AutoComplite datas = {autoCompliteData} onSelected = {this.handleAutoCompliteSelected} />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="desc">Description</Label>
          <Input type="text" id="desc" value={data.desc} autoComplete="off" onChange={this.handleChange} />
        </FormGroup>

        <Row form>
          <Col md={6}>
            <FormGroup>
              <Input type="file" id="image" onChange={this.handleImageUpload} />
            </FormGroup>
          </Col>
          {data.image &&
            <Col md={6}>
              {/* <FormGroup> */}
              <div >
                <img style={{ width: 250, height: 200 }}
                  alt="..."
                  src={window.URL.createObjectURL(data.image)}
                />
              </div>
            </Col>
          }
        </Row>

        <Button onClick={this.handleSubmit } color="primary">Submit</Button>
      </Form>
    )
  }

  renderDropDown(dropDownState) {
    return dropDownState.map((value, key) => {
      return (
        <DropdownItem key={`dropdownItem_${key}`} id={value.id} onClick={this.handleDropDownClick}>
          {value.name}
        </DropdownItem>
      )
    })
  }

  render() {
    if (this.props.classificationAndItems === null) {
      return <div className="loader"></div>
    }

    const name = this.state.dropDownItemSelected.name
    const data = this.state[name]

    return (
      <Container className="mt--7" fluid>

        <React.Fragment>
          <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <Row>
                      <Col className="col-sm">
                        <h3 className="mb-0">Insert UC/NA/NM/Item</h3>
                      </Col>
                      <Col className="col-sm " >
                        <UncontrolledDropdown group className="float-right">
                          <DropdownToggle caret color="info" id={this.state.dropDownItemSelected.id}>
                            {this.state.dropDownItemSelected.name}
                          </DropdownToggle>
                          <DropdownMenu>
                            {this.renderDropDown(dropDownState)}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
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
                          ? <AlertElement msg={'User successfully inserted!'} level={ 'info'} />
                          : null
                        : null
                    }
                  </CardHeader>

                  <CardBody>
                    {name === 'ITEM' ? this.renderItemForm(data) : this.renderClassificationForm(data)}
                  </CardBody>

                </Card>
              </div>
            </Row>
          </Container>
        </React.Fragment>
      </Container>
    )
  }
}
export default InsertItemsClassification


import React from 'react'

// reactstrap components
import { Container, Form, FormGroup, Label, Row, Col, Card, CardHeader, CardBody, DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import AutoComplite from '../../components/AutoComplite'
import TestTree from '../../components/TestTree'

class TableAudit extends React.Component {
  constructor(props) {
    super(props)

    this.selectedEmployee = {}
    this.state = {
      selectedEmployee: props.allEmployees[0],
      dropDown: [],
      dropDownItemSelected: null
    }
    this.handleAutoCompliteSelected = (selectedEmployee) => {
      const dropDownData = this.getDropDownData(selectedEmployee)

      this.setState({
        selectedEmployee,
        dropDownItemSelected: dropDownData.dropDownItemSelected,
        dropDown: dropDownData.dropDownAudit
      })
    }

    this.getDropDownData = (selectedEmployee) => {
      const employeeAudits = this.props.audit && selectedEmployee && this.props.audit[selectedEmployee.id]
      const dropDownAudit = []
      let dropDownItemSelected = null
      for (var auditId in employeeAudits) {
        const dropDownItem = { id: auditId, name: employeeAudits[auditId].name, status: employeeAudits[auditId].status }

        if (dropDownItemSelected === null) {
          dropDownItemSelected = dropDownItem
        }

        dropDownAudit.push(dropDownItem)
      }

      const response = {}
      response.dropDownItemSelected = dropDownItemSelected
      response.dropDownAudit = dropDownAudit

      return response
    }

    this.handleDropDownClick = (value) => {
      this.setState({
        dropDownItemSelected: value
      })
    }
  }

  componentDidMount() {
    const dropDownData = this.getDropDownData(this.state.selectedEmployee)

    this.setState({
      dropDown: dropDownData.dropDownAudit,
      dropDownItemSelected: dropDownData.dropDownItemSelected
    })
  }

  render() {
    const selectedAudit = this.props.audit && this.state.selectedEmployee && this.props.audit[this.state.selectedEmployee.id]
    return (
      this.state.selectedEmployee && this.state.dropDownItemSelected
        ? <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader className="border-0 pb-0">

              <Form className="m-3" >
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parentId">Select Employee</Label>
                      <AutoComplite datas = {this.props.allEmployees} onSelected = {this.handleAutoCompliteSelected} startValue={this.state.selectedEmployee.name} />
                    </FormGroup>
                  </Col>
                  <Col md={1}></Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="parentId">Select Audit</Label>
                      {
                        this.state.dropDown &&
                          <UncontrolledDropdown>
                            <DropdownToggle caret color="info" id={this.state.dropDownItemSelected.id}>
                              {`${this.state.dropDownItemSelected.name} (${this.state.dropDownItemSelected.status})`}
                            </DropdownToggle>
                            <DropdownMenu
                              modifiers={{
                                setMaxHeight: {
                                  enabled: true,
                                  order: 890,
                                  fn: (data) => {
                                    return {
                                      ...data,
                                      styles: {
                                        ...data.styles,
                                        overflow: 'auto',
                                        maxHeight: '200px'
                                      }
                                    }
                                  }
                                }
                              }}
                            >
                              {
                                this.state.dropDown.map((dd, _i) => (
                                  <DropdownItem key={`dropdownItem_${_i}`} id={dd.id} onClick={this.handleDropDownClick.bind(this, dd)}>
                                    {`${dd.name} (${dd.status})`}
                                  </DropdownItem>
                                ))
                              }
                            </DropdownMenu>
                          </UncontrolledDropdown>
                      }
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardHeader>
            <CardBody className="border-0 pt-0">
              <TestTree
                name="Audit"
                items={this.props.items}
                audit={selectedAudit[this.state.dropDownItemSelected.id].items}
              />
            </CardBody>
          </Card>
        </Container>
        : <div >No data</div>
    )
  }
}

export default TableAudit

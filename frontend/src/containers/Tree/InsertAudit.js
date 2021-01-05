
import React from 'react'

// reactstrap components
import { Container, Button, Form, FormGroup, Label, Row, Col, Card, CardHeader, CardBody, Input } from 'reactstrap'
import AutoComplite from '../../components/AutoComplite'
import TestTree from '../../components/TestTree'
import clone from '../../utils/cloneArray'
import AlertElement from '../../components/AlertElement'

class IsertAudit extends React.Component {
  constructor(props) {
    super(props)

    this.selectedEmployee = {}
    this.submit = false
    this.items = clone(props.items)
    this.state = {
      auditName: ''
    }

    this.handleChange = (event) => {
      this.setState({ [event.target.id]: event.target.value })
    }

    this.submitAudit = () => {
      if (this.treeAudit) {
        const payload = {
          audit: this.treeAudit.getItemsAndReset(),
          assignTo: this.selectedEmployee.id,
          name: this.state.auditName
        }
        if (payload.assignTo && payload.audit.length > 0) {
          this.selectedEmployee = {}
          this.autocomplite.clearValue()
          this.items = clone(this.props.items)
        }
        this.props.insertAudit(payload)
        this.submit = true
      }
    }

    this.handleAutoCompliteSelected = (selectedEmployee) => {
      this.selectedEmployee = selectedEmployee
    }
  }

  render() {
    return (
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader className="border-0 pb-0">

            {
              this.submit && this.props.errMsg != null
                ? <AlertElement msg={this.props.errMsg} />
                : null

            }
            {
              this.submit && this.props.insertSuccess !== false
                ? <AlertElement msg={'Audit successfully inserted!'} level={ 'info'} />
                : null
            }
            <Button
              className="m-4"
              style={{ position: 'absolute', top: 44, right: 0, zIndex: 10 }}
              color="primary"
              type="button"
              onClick={this.submitAudit}>
              Submit Items
            </Button>
            <Form className="m-3" >
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="parentId">Employee to assign</Label>
                    {this.props.allEmployees &&
                      <AutoComplite
                        datas = {this.props.allEmployees}
                        onSelected = {this.handleAutoCompliteSelected}
                        ref={(reff) => { this.autocomplite = reff }} />
                    }
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="auditName">Audit name</Label>
                    <Input type="text" id="auditName" autoComplete="off" value={this.state.auditName} onChange={this.handleChange}/>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardHeader>
          <CardBody className="border-0 pt-0">
            <TestTree
              ref={reff => { this.treeAudit = reff }}
              name="Choose Locations"
              items={this.items }
              hasSearch={true}
              hasCheckBox={true}
            />
          </CardBody>
        </Card>
      </Container>
    )
  }
}

export default IsertAudit

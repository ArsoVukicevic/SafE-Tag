import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col
} from 'reactstrap'
import { selectTableOfFactories } from '../Admin/selectors'
import { getFactoriesAction } from '../Admin/reducer'

const actionsToProps = dispatch => ({
  getFactories: (payload) => dispatch(getFactoriesAction(payload))
})

const stateToProps = state => ({
  factories: selectTableOfFactories(state)
})

class FactoryTable extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleNextPreviousChange = this.handleNextPreviousChange.bind(this)
    this.renderPaginationItems = this.renderPaginationItems.bind(this)

    this.state = {
      rowsPerPage: 10,
      currentPage: 1
    }
  }

  componentDidMount() {
    console.log('Factories Tables componentDidMount')
    if (!this.props.factories) {
      this.props.getFactories()
    }
  }

  handleChange(event) {
    this.setState({ currentPage: Number(event.target.id) })
    event.preventDefault()
  }

  handleNextPreviousChange(event) {
    const currentPage = this.state.currentPage
    if (event.target.id === 'previousClick') {
      this.setState({ currentPage: Number(currentPage - 1) })
    } else {
      this.setState({ currentPage: Number(currentPage + 1) })
    }

    event.preventDefault()
  }

  renderTableBody(factories) {
    const nextPageTo = this.state.rowsPerPage * this.state.currentPage
    const nextPageFrom = nextPageTo - this.state.rowsPerPage
    const tableRows = factories.slice(nextPageFrom, nextPageTo).map(f => {
      return (
        <tr key ={`factory_${f.id}`}>
          <td>{f.name}</td>
          <td>{f.address}</td>
          <td>{f.phone}</td>
          <td>{f.info}</td>
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i className={f.licencePaid === true ? 'bg-success' : 'bg-warning'} />
              {f.licencePaid === true ? 'Paid' : 'Not Paid'}
            </Badge>
          </td>

          <td className="text-right">
            <Link
              to={{
                pathname: '/admin/edit-factory',
                factoryForEdit: f
              }}>
              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                <i className="fas fa-pencil-alt"/>
              </div>
            </Link>
          </td>
        </tr>
      )
    })

    return tableRows
  }

  renderPaginationItems(maxPages) {
    const items = []
    console.log('renderPaginationItems', this.state.currentPage)
    for (let i = 1; i <= maxPages; i++) {
      items.push(
        <PaginationItem key={i} className={this.state.currentPage === i ? 'active' : null}>
          <PaginationLink
            id = {i}
            href="#pablo"
            onClick={this.handleChange}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  render() {
    console.log('Factory Tables rendering', this.props.factories)
    const maxPages = this.props.factories && Math.ceil(this.props.factories.length / this.state.rowsPerPage)

    return (
      <React.Fragment>
        {/* Header blue Gradient */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />

        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col xs="10"><h3 className="mb-0">Factories table</h3></Col>
                    <Col xs="2" className="text-right">
                      <Link to="/admin/insert-factory" >
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow ">
                          <i className="fas fa-plus" />
                        </div>
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Info</th>
                      <th scope="col">Licence</th>
                      <th scope="col" />
                    </tr>
                  </thead>

                  <tbody>
                    {this.props.factories && this.renderTableBody(this.props.factories)}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className={this.state.currentPage === 1 ? 'disabled' : null}>
                        <PaginationLink
                          id='previousClick'
                          href="#pablo"
                          onClick={this.handleNextPreviousChange}
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>

                      { this.renderPaginationItems(maxPages)}

                      <PaginationItem
                        className={
                          maxPages === this.state.currentPage
                            ? 'disabled'
                            : null
                        }
                      >
                        <PaginationLink
                          id='nextClick'
                          href="#pablo"
                          onClick={this.handleNextPreviousChange}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default connect(stateToProps, actionsToProps)(FactoryTable)

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
import Roles from '../../types/Roles.js'
import { getUsersAction, search } from '../Admin/reducer.js'
import { selectTableOfUsers, selectSearchQuery } from '../Admin/selectors.js'
import { selectUser } from '../Auth/selectors.js'

const actionsToProps = dispatch => ({
  getUsersAction: (payload) => dispatch(getUsersAction(payload)),
  search: (payload) => dispatch(search(payload))
})

const stateToProps = state => ({
  tableOfUser: selectTableOfUsers(state),
  user: selectUser(state),
  searchQuery: selectSearchQuery(state)
})

class UsersTable extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleNextPreviousChange = this.handleNextPreviousChange.bind(this)
    this.renderPaginationItems = this.renderPaginationItems.bind(this)

    console.log('Tables constructor', props)

    this.state = {
      rowsPerPage: 10,
      currentPage: 1,
      tableOfUser: []
    }
  }

  searchForQuery(user, tableQuery) {
    if (tableQuery === null || tableQuery === '') {
      return true
    }

    tableQuery = tableQuery.toLowerCase()
    const queryMatchIndex = Object.values(user).findIndex(props => {
      if (typeof props === 'string' && props.toLowerCase().includes(tableQuery)) {
        return true
      } else if (typeof props === 'object') {
        return props.name.toLowerCase().includes(tableQuery) ||
                ('paid'.search(tableQuery) === 0 && props.licencePaid === true) ||
                ('not paid'.search(tableQuery) === 0 && props.licencePaid === false)
      }
    })

    return queryMatchIndex !== -1
  }

  filterTable(searchQuery) {
    const filteredTable = this.props.tableOfUser.filter(user => {
      return this.searchForQuery(user, searchQuery)
    })
    this.setState({ tableOfUser: filteredTable, currentPage: 1 })
    console.log('filteredTable', filteredTable)
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

  renderTableBody(tableOfUser) {
    const nextPageTo = this.state.rowsPerPage * this.state.currentPage
    const nextPageFrom = nextPageTo - this.state.rowsPerPage
    const tableRows = tableOfUser.slice(nextPageFrom, nextPageTo).map(user => {
      return (
        <tr key = {user.id}>
          <td>{user.name}</td>
          <td>{user.lastname}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>{user.isActive ? 'ACTIVE' : 'IN ACTIVE'}</td>
          {this.props.user.role === Roles.OWNER ? <td>{user.factory.name}</td> : null}
          {this.props.user.role === Roles.OWNER
            ? <td>
              <Badge color="" className="badge-dot mr-4">
                <i className={user.factory.licencePaid === true ? 'bg-success' : 'bg-warning'} />
                {user.factory.licencePaid === true ? 'Paid' : 'Not Paid'}
              </Badge>
            </td>
            : null
          }

          <td className="text-right">
            <Link
              to={{
                pathname: '/admin/edit-user',
                userForEdit: user
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

  renderPaginationItems() {
    const items = []
    const maxPages = Math.ceil(this.state.tableOfUser.length / this.state.rowsPerPage)
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

  componentDidMount() {
    console.log('Tables componentDidMount')
    if (!this.props.tableOfUser) {
      this.props.getUsersAction()
    } else {
      this.filterTable(this.props.searchQuery)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tableOfUser && prevProps.tableOfUser !== this.props.tableOfUser) {
      this.filterTable(this.props.searchQuery)
    }
    if (prevProps.searchQuery !== this.props.searchQuery && this.props.tableOfUser) {
      this.filterTable(this.props.searchQuery)
    }
  }

  componentWillUnmount() {
    console.log('Tables componentWillUnmount')
    this.props.search('')
    // clear search
  }

  render() {
    console.log('Tables rendering', this.state)
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
                    <Col xs="10"><h3 className="mb-0">Users table</h3></Col>
                    <Col xs="2" className="text-right">
                      <Link to="/admin/insert-user" >
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
                      <th scope="col">Lastname</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Email</th>
                      <th scope="col">SafE-Tag Role</th>
                      <th scope="col">Is active</th>
                      {this.props.user.role === Roles.OWNER ? <th scope="col">Factory Name</th> : null}
                      {this.props.user.role === Roles.OWNER ? <th scope="col">Licence</th> : null}
                      <th scope="col" />
                    </tr>
                  </thead>

                  <tbody>
                    {this.renderTableBody(this.state.tableOfUser)}
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

                      {this.renderPaginationItems()}

                      <PaginationItem
                        className={
                          Math.ceil(this.state.tableOfUser.length / this.state.rowsPerPage) === this.state.currentPage
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

export default connect(stateToProps, actionsToProps)(UsersTable)

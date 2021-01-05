import React from 'react'

import closedIconImg from '../assets/img/icons/closedIcon.png'
import openedIconImg from '../assets/img/icons/openedIcon.png'
import noNodesIconImg from '../assets/img/icons/no-nodes.png'
// reactstrap components
import {
  ModalFooter,
  Col,
  Button,
  Modal,
  Card, ModalHeader, CardBody,
  ModalBody, Row, CustomInput, Input,
  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, ListGroupItem, ListGroup, CardHeader
} from 'reactstrap'
import TreeMenu from 'react-simple-tree-menu'
import clone from '../utils/cloneArray'
import { COLORS } from '../constants'
import { Link } from 'react-router-dom'
import auditItemSeasch from '../utils/auditItemSearch'

const iconStyle = {
  verticalAlign: 'text-bottom'
}
const openedIcon = <img src={openedIconImg} className="mx-2" alt="-" style={iconStyle}></img>
const closedIcon = <img src={closedIconImg} className="mx-2" alt="+" style={iconStyle}></img>
const noNodesIcon = <img src={noNodesIconImg} className="mx-2" alt="+" style={iconStyle}></img>

const ListItem = ({
  focused,
  active,
  hasNodes,
  toggleNode,
  isOpen,
  name,
  level,
  desc,
  image,
  openNodes,
  searchTerm,
  openImage,
  id, // used for edit action
  isItemActive,
  source,
  ...props
}) => (
  <ListGroupItem
    {...props}
    className={`p-0 ${focused ? 'bg-gradient-info' : ''} ` }
    style={{
      display: 'flex',
      boxShadow: focused ? '0px 0px 5px 0px #222' : 'none'
    }}
  >
    <div
      className="w-100 py-3 "
      onClick={e => {
        hasNodes && toggleNode && toggleNode()
      }}
      style={{
        paddingLeft: 16 + 8 + level * 16,
        cursor: 'pointer',
        zIndex: focused ? 999 : 'unset',
        position: 'relative'
      }}>
      <div
        style={{ display: 'inline-block' }}

      >
        {hasNodes ? isOpen ? openedIcon : closedIcon : noNodesIcon}
        {/* <ToggleIcon on={isOpen} onClick={toggleNode} /> */}
      </div>
      <i className="fa fa-eye mx-2" aria-hidden="true" onClick={() => openImage({ name, desc, image })}></i>
      {name}
    </div>

    <div style={{ float: 'right', display: 'flex' }} className="m-2">
      <Link
        to={{
          pathname: '/admin/tree/edit-items',
          item: { id: id, source: source, name: name, desc: desc, isActive: isItemActive, image: image }
        }}>
        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
          <i className="fas fa-pencil-alt"/>
        </div>
      </Link>
    </div>
  </ListGroupItem>
)

const CheckBoxItem = ({
  focused,
  active,
  hasNodes,
  toggleNode,
  isOpen,
  openNodes,
  searchTerm,
  item,
  selectItems,
  isItemActive,
  ...props
}) => (
  <ListGroupItem
    {...props}
    className={'p-0  ' }
  >
    <div
      className="w-100 py-3 "
      onClick={e => {
        item.hasNodes && item.toggleNode && item.toggleNode()
      }}
      style={{
        paddingLeft: 16 + 8 + item.level * 16,
        cursor: 'pointer',
        position: 'relative'
      }}>
      <div
        style={{ display: 'inline-block' }}

      >  {item.hasNodes ? item.isOpen ? openedIcon : closedIcon : noNodesIcon}
        <CustomInput
          type="checkbox"
          id={item.key}
          label={item.name}
          style={{ display: 'inline' }}
          checked={item.selected || false}
          onChange={() => { selectItems(item) }}
        />

      </div>
    </div>
  </ListGroupItem>
)

const AuditItem = ({
  focused,
  active,
  hasNodes,
  toggleNode,
  isOpen,
  openNodes,
  searchTerm,
  item,
  selectItems,
  isItemActive,
  ...props
}) => (
  <ListGroupItem
    {...props}
    className={'p-0  ' }
  >
    <div
      className="w-100 py-3 pr-3 "
      onClick={e => {
        item.hasNodes && item.toggleNode && item.toggleNode()
      }}
      style={{
        paddingLeft: 16 + 8 + item.level * 16,
        cursor: 'pointer',
        position: 'relative'
      }}>
      <div
        style={{ display: 'inline-block' }}

      >  {item.hasNodes ? item.isOpen ? openedIcon : closedIcon : noNodesIcon}
        {item.name}
      </div>
      <div
        style={{ display: 'inline-block', float: 'right', width: '10%', backgroundColor: COLORS[item.status] }}
        className="p-2 my-1"
      >
      </div>
    </div>
  </ListGroupItem>
)

class TestTree extends React.Component {
  constructor(props) {
    super(props)
    this.selected = []
    this.nodes = []
    this.keyTree = 1
    this.state = {
      render: false,
      modal: false,
      selectedItem: {},
      dropDownItemSelected: {}
    }

    this.openImage = (item) => {
      this.setState(
        {
          modal: true,
          selectedItem: item
        }
      )
    }
    this.toggleModal = () => {
      this.setState(
        { modal: !this.state.modal }
      )
    }

    this.handleDropDownClick = (value) => {
      this.items = clone(this.props.items[value.id])

      this.setState({
        dropDownItemSelected: value
      })
    }

    this.selectItems = (selectedItem) => {
      auditItemSeasch(selectedItem, this.items, this.selected)
    }

    this.getItemsAndReset = () => {
      const temp = this.selected
      this.selected = []
      return temp
    }
    this.hasAudit = (item) => {
      const keys = item.key.split('/')
      const i = this.props.audit.findIndex(a => keys[keys.length - 1] == a.id)
      item.status = i !== -1 && this.props.audit[i].status
      return this.props.audit && i !== -1
    }

    this.renderItems = (items) => {
      return items.map((item) => {
        return (
          this.props.hasCheckBox
            ? <CheckBoxItem
              {...item}
              item={item}
              key={item.key}
              selectItems={this.selectItems}
            />
            : !this.props.audit
              ? <ListItem
                {...item}
                key={item.key}
                id={item.key}// used for edit action because key is not posible to read as props
                source={this.props.name}
                openImage={this.openImage}
              />
              : this.hasAudit(item)
                ? <AuditItem
                  {...item}
                  item={item}
                  key={item.key}
                />
                : null
        )
      }
      )
    }

    this.openAllRec = (items, parent) => {
      items.map(node => {
        if (node.nodes.length > 0) {
          if (parent) { this.openNodes.push(parent + '') }
          this.openAllRec(node.nodes, parent ? parent + '/' + node.key : node.key)
        } else {
          this.openNodes.push(parent + '')
        }
      })
    }

    this.openAll = () => {
      this.openNodes = []
      this.openAllRec(this.items, null)
      this.keyTree++
      this.setState({ render: !this.state.render })
    }
  }

  componentDidMount() {
    if (this.props.items) {
      if (this.props.dropDown) {
        this.items = clone(this.props.items[this.props.dropDown[0].id])
        this.setState({
          dropDownItemSelected: this.props.dropDown[0]
        })
      } else {
        this.items = clone(this.props.items)
        this.setState({
          render: !this.state.render
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.items !== prevProps.items) {
      this.keyTree++
      this.openNodes = []
      if (this.props.dropDown) {
        this.items = clone(this.props.items[this.props.dropDown[0].id])
        this.setState({
          dropDownItemSelected: this.props.dropDown[0]
        })
      } else {
        this.items = clone(this.props.items)
        this.setState({
          render: !this.state.render
        })
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xxs="12" className="mb-4">
            <Card>
              <CardHeader className="border-0">
                <Row>
                  <Col className="col-sm">
                    <h3>{this.props.name}</h3>
                    <Button className="my-2" color="primary" type="button" onClick={this.openAll}>
                      Open All
                    </Button>
                  </Col >
                  <Col className="col-sm">
                    {
                      this.props.dropDown &&
                    <UncontrolledDropdown group className="float-right mr-4">
                      <DropdownToggle caret color="info" id={this.state.dropDownItemSelected.id}>
                        {this.state.dropDownItemSelected.name}
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          this.props.dropDown.map((dd, _i) => (
                            <DropdownItem key={`dropdownItem_${_i}`} id={dd.id} onClick={this.handleDropDownClick.bind(this, dd)}>
                              {dd.name}
                            </DropdownItem>
                          ))
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    }
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="pt-0">
                <React.Fragment>
                  { this.items &&
                  <TreeMenu
                    data={this.items}
                    key={this.keyTree}
                    debounceTime={125}
                    matchSearch={({ name, searchTerm }) => (name.toLowerCase().includes(searchTerm.toLocaleLowerCase()))}
                    onClickItem={() => {}}
                    initialOpenNodes={this.openNodes}
                  >
                    {({ search, items }) => (
                      <>
                        { this.props.hasSearch &&
                          <Input onChange={e => search(e.target.value)} placeholder="Type and search" className="mb-2"/>
                        }
                        <ListGroup>
                          {this.renderItems(items)}
                        </ListGroup>
                      </>
                    )}
                  </TreeMenu >
                  }
                </React.Fragment>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} >
          <ModalHeader toggle={this.toggleModal}>{this.state.selectedItem.name}</ModalHeader>
          <ModalBody>
            <h5>{this.state.selectedItem.desc}</h5>

            {this.state.selectedItem.image &&
              <div >
                <hr></hr>
                <h5>Image</h5>
                <img src={`/images/${this.state.selectedItem.image}`} alt="Trulli" width="100%" height="200" />
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}
export default TestTree

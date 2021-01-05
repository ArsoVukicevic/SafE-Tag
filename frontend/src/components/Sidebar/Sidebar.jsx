
/*eslint-disable*/
import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

import {sidebarRoutes} from '../../routes'
import avatarIcon from '../../assets/img/icons/avatar.png'
import logoIcon from '../../assets/img/icons/logo.png'

class Sidebar extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      collapseOpen: false
    };

    this.activeRoute = () => {
      return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    this.toggleCollapse = () => {
      this.setState({
        collapseOpen: !this.state.collapseOpen
      });
    };

    this.closeCollapse = () => {
      this.setState({
        collapseOpen: false
      });
    };

    this.renderNavigation = (sidebarRoutes) => {
      return sidebarRoutes.map(route => {
        return (
          <NavItem key={`navItem_${route.id}`}>
            <NavLink
              to={route.path}
              tag={NavLinkRRD}
              onClick={this.closeCollapse}
            >
              <i className={route.iconClass} />
              {route.name}
            </NavLink>
          </NavItem>
        )
      });
    }
  }

  

  render() {
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}
            <NavbarBrand className="pt-0" >
              <img
                className="navbar-brand-img"
                src={logoIcon}
              />
            </NavbarBrand>
          {/* User */}
          <Nav className="align-items-center d-md-none">

            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={avatarIcon}
                      />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                  <Col className="collapse-brand" xs="6">
                    <img src={logoIcon} />
                  </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
              {
                Object.keys(sidebarRoutes).map((key, index) => {
                  return sidebarRoutes[key].roles.includes(this.props.user.role)
                  ? (
                    <React.Fragment key={key}>
                      <h6 key={`navbar-heading_${key}`} className="navbar-heading text-muted">{sidebarRoutes[key].headTitle}</h6>
                      <Nav key={`sidebarnav_${key}`} navbar>
                        {this.renderNavigation(sidebarRoutes[key].routes)} 
                      </Nav> 
                      {/* Divider */}
                      <hr className="my-3" />
                   </React.Fragment >
                   ) : null
                })
              }
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Sidebar;

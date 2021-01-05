import React from 'react'

// reactstrap components
import { Container, Row, Col } from 'reactstrap'

class ProfileHeader extends React.Component {
  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 d-flex align-items-center"
          style={{
            minHeight: '500px',
            backgroundSize: 'cover',
            backgroundPosition: 'center top'
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="7" md="10">
                <h1 className="display-2 text-white">Hello {this.props.user.username}</h1>
                <p className="text-white mt-0 mb-5">
                  This is factory profile page. You can see and manage your factory data
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    )
  }
}

export default ProfileHeader

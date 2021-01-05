import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.doDelete = this.doDelete.bind(this)
  }

  toggleModal () {
    this.setState({ modal: !this.state.modal })
  }

  doDelete () {
    this.props.onDelete()
    this.toggleModal()
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggleModal} >
        <ModalHeader toggle={this.toggleModal}>Delete</ModalHeader>
        <ModalBody>
        Are you shure you want to delete this item?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          <Button color="danger" onClick={this.doDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default DeleteModal

import React, { Component } from 'react';
import { View, Text, Modal, Toast } from '@src/components/core';
import styles from './style';

let Com;

const closeQrScanner = () => {
  if (typeof Com?.closeModal === 'function') {
    Com.closeModal();
  } else {
    Toast.showWarning('Please make sure the app has access to your camera and try again.');
  }
};

const openQrScanner = (onData) => {
  if (typeof Com?.openModal === 'function') {
    Com.onDataHook = onData;
    Com.openModal();
  } else {
    Toast.showWarning('Please make sure the app has access to your camera and try again.');
  }
};

const NotAuthorizedView = (
  <View>
    <Text>Can not use QR Scanner right now, please enable camera permission</Text>
  </View>
);

class QrScanner extends Component {
  constructor() {
    super();

    this.state = {
      open: false
    };
  }
  componentDidMount() {
    Com = this;
  }

  handleSuccess = data => {
    if (typeof this.onDataHook === 'function') {
      this.onDataHook(data?.data);
    }
    this.closeModal();
  }

  closeModal = () => this.setState({ open: false })

  openModal = () => this.setState({ open: true })

  render() {
    const { open } = this.state;
    return (
      <Modal
        visible={open}
        close={this.closeModal}
      >
        <View style={styles.container}>
          <View>
          </View>
        </View>
      </Modal>
    );
  }
}

QrScanner.defaultProps = {
};

QrScanner.propTypes = {
};

export default QrScanner;

export { closeQrScanner, openQrScanner };

import React, { Component } from 'react';
import {
  Dimensions,
  Modal,
  View, Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { retryExpiredDeposit } from '@src/services/api/history';
import { ExHandler } from '@src/services/exception';
import { Toast, Button } from '@src/components/core';
import LogManager from '@src/services/LogManager';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FONT } from '@src/styles';
import styles from './styles';
import TxHistoryDetail from './TxHistoryDetail';

const { width, height } = Dimensions.get('window');
class TxHistoryDetailContainer extends Component {
  state = {
    data: null,
    shouldShowTxModal: false,
    errorTx: false,
    txOutchain: '',
    shouldEnableBtn: false,
  };

  componentDidMount() {
    this.loadHistoryData();
  }

  loadHistoryData = () => {
    const { navigation } = this.props;
    const data = navigation?.getParam('data');

    this.setState({ data });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  retryExpiredDeposit = async (data, isDecentralized) => {
    try {
      if (data) {
        const { txOutchain } = this.state;
        if (isDecentralized) {
          if (txOutchain === '') {
            return;
          }
          let newData = { ...data.history, TxOutchain: txOutchain };
          await retryExpiredDeposit(newData);
        } else {
          await retryExpiredDeposit(data);
        }
        const decentralizedMSg = 'Your request has been sent, we will process it soon.';
        const centralizedMSg = 'Your request has been sent, we will process it soon. The history status will be updated';

        Toast.showInfo(isDecentralized ? decentralizedMSg : centralizedMSg);
        this.goBack();
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not process this expired deposit request. Please try again.').showErrorToast();
    }
  }
  renderModalTXOutchain = () => {
    const { shouldShowTxModal, errorTx, shouldEnableBtn } = this.state;
    return (
      <Modal
        transparent
        animationType="none"
        visible={shouldShowTxModal}
        onRequestClose={() => {

        }}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ shouldShowTxModal: false, errorTx: false, shouldEnableBtn: false }); }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => { }}>
              <View style={styles.modalContent}>
                <Text style={styles.titleModal}>{'If you\'ve already sent funds to the deposit address, just enter your transaction ID here. Your balance will update within 24 hours.'}</Text>
                <TextInput
                  onChangeText={text => {
                    if (text.replace(/ /g, '').length === 0) {
                      this.setState({ errorTx: true, shouldEnableBtn: false });
                    } else {
                      this.setState({ txOutchain: text, errorTx: false, shouldEnableBtn: true });
                    }
                  }}
                  returnKeyType="done"
                  placeholder="TransactionID"
                  numberOfLines={1}
                  style={styles.txField}
                />
                <Text style={[styles.titleModal, styles.warning]}>{errorTx ? 'Tx required' : ''}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    style={[styles.submitBTN, { opacity: errorTx ? 0.8 : 1 }]}
                    disabled={!shouldEnableBtn}
                    title='Submit'
                    onPress={async () => {
                      const { data, txOutchain } = this.state;
                      if (txOutchain != '') {
                        await this.retryExpiredDeposit(data, true);
                        this.setState({ shouldShowTxModal: false, errorTx: false });
                      } else {
                        this.setState({ errorTx: true });
                      }
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
  render() {
    const { data } = this.state;
    let decentralized = data?.history?.decentralized;
    if (!data) {
      return <LoadingContainer />;
    }

    return (
      <View>
        <TxHistoryDetail
          {...this.props}
          data={data}
          onRetryExpiredDeposit={() => {
            if (decentralized) {
              this.setState({ shouldShowTxModal: true });
            } else {
              this.retryExpiredDeposit(data?.history, false);
            }
          }}
        />
        {this.renderModalTXOutchain()}
      </View>
    );
  }
}

TxHistoryDetailContainer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default TxHistoryDetailContainer;
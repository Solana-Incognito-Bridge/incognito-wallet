import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectedPrivacySeleclor, sharedSeleclor } from '@src/redux/selectors';
import CryptoItem from './CryptoItem';

class CryptoItemContainer extends Component {

  handlePress = () => {
    const { onPress, data } = this.props;
    if (typeof onPress === 'function') {
      onPress(data);
    }
  };
  
  render() {
    const { data, isGettingBalanceList } = this.props;

    if (!data) return null;

    const fullName = data?.displayName;
    const name = data?.networkName;

    const cryptoItemProps = {
      ...this.props,
      fullName,
      name,
      amount: data?.amount,
      symbol: data?.symbol,
      tokenId: data?.tokenId,
      externalSymbol: data?.externalSymbol,
      pDecimals: data?.pDecimals,
      onPress: this.handlePress,
      isGettingBalance: isGettingBalanceList?.includes(data?.tokenId)
    };

    return (
      <CryptoItem
        {...cryptoItemProps}
      />
    );
  }
}


CryptoItemContainer.defaultProps = {
  onPress: null,
  style: null,
  isGettingBalanceList: [],
  data: null
};

CryptoItemContainer.propTypes = {
  onPress: PropTypes.func,
  isGettingBalanceList: PropTypes.array,
  style: PropTypes.object,
  data: PropTypes.object
};

const mapState = (state, props) => ({
  data: selectedPrivacySeleclor.getPrivacyDataByTokenID(state)(props?.tokenId),
  isGettingBalanceList: sharedSeleclor.isGettingBalance(state)
});

export default connect(mapState)(CryptoItemContainer);

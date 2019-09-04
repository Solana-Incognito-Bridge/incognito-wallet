import { Toast } from '@src/components/core';
import { reloadAccountList } from '@src/redux/actions/wallet';
import { followDefaultTokens} from '@src/redux/actions/account';
import { accountSeleclor } from '@src/redux/selectors';
import accountService from '@src/services/wallet/accountService';
import { getPassphrase } from '@src/services/wallet/passwordService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccount from './ImportAccount';

class ImportAccountContainer extends Component {
  followDefaultTokens = async account => {
    try {
      const { followDefaultTokens } = this.props;
      await followDefaultTokens(account);
    } catch (e) {
      console.error('Can not follow default tokens for this account', e);
    }
  }

  importAccount = async ({ accountName, privateKey }) => {
    try {
      const { wallet, reloadAccountList } = this.props;
      const passphrase = await getPassphrase();

      const isImported = await accountService.importAccount(
        privateKey,
        accountName,
        passphrase,
        wallet
      );
      if (!isImported) throw new Error('Account was not imported!');

      Toast.showSuccess('Import successful.');

      await reloadAccountList();

      // follow default tokens
      // getAccountByName must be get from props again to make sure list account up to date
      const { getAccountByName } = this.props;
      const account = getAccountByName(accountName);
      await this.followDefaultTokens(account);

      return true;
    } catch(e) {

      Toast.showError('Something went wrong. Please try again.');
      throw e;
    }
  };

  render() {
    return <ImportAccount {...this.props} importAccount={this.importAccount} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  accountList: state.account.list || [],
  getAccountByName: accountSeleclor.getAccountByName(state),
});

const mapDispatch = { reloadAccountList, followDefaultTokens };

ImportAccountContainer.propTypes = {
  wallet: PropTypes.object.isRequired,
  reloadAccountList: PropTypes.func.isRequired,
  followDefaultTokens: PropTypes.func.isRequired,
  getAccountByName: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch,
  null,
  {
    forwardRef: true
  }
)(ImportAccountContainer);

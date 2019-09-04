import {
  Container,
  Toast,
  Button,
  View
} from '@src/components/core';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import React from 'react';
import styleSheet from './style';

const formName = 'importAccount';
const Form = createForm(formName);
const isRequired = validator.required();

const ImportAccount = ({ navigation, accountList, importAccount }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleImportAccount = async ({ accountName, privateKey }) => {
    const lowerCase = str => String(str).toLowerCase();
    try {
      if (
        accountList.find(
          _account => lowerCase(_account.name) === lowerCase(accountName)
        )
      ) {
        Toast.showError(
          'This account already exists on your device. Please try another.'
        );
        return;
      }

      await importAccount({ privateKey, accountName });
      goBack();
    } catch (e) {
      Toast.showError('Please make sure this private key is valid and does not already exist on your device.');
    }
  };

  return (
    <Container style={styleSheet.container}>
      <Form>
        {({ handleSubmit, submitting }) => (
          <View style={styleSheet.form}>
            <Field
              component={InputField}
              name='accountName'
              placeholder='Account Name'
              label='Account Name'
              validate={[isRequired]}
            />
            <Field
              component={InputField}
              name='privateKey'
              placeholder='Private Key'
              label='Private Key'
              validate={[isRequired]}
            />
            <Button
              title='Import account'
              style={styleSheet.submitBtn}
              onPress={handleSubmit(handleImportAccount)}
              isAsync
              isLoading={submitting}
            />
          </View>
        )}
      </Form>
    </Container>
  );
};

ImportAccount.defaultProps = {
  accountList: [],
  importAccount: null,
};

ImportAccount.propTypes = {
  navigation: PropTypes.object.isRequired,
  accountList: PropTypes.array,
  importAccount: PropTypes.func,
};

export default ImportAccount;

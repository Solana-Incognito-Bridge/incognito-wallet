import React from 'react';
import _ from 'lodash';
import formatUtils from '@utils/format';
import { MIN_PERCENT } from '@screens/DexV2/constants';
import { calculateOutputValue as calculateOutput } from './utils';

const withCalculateOutput = WrappedComp => (props) => {
  const [outputValue, setOutputValue] = React.useState(0);
  const [outputText, setOutputText] = React.useState('0');
  const [minimumAmount, setMinimumAmount] = React.useState(0);

  const { inputToken, inputValue, outputToken, pair } = props;

  const calculateOutputValue = () => {
    let outputValue = calculateOutput(pair, inputToken, inputValue, outputToken);

    if (outputValue < 0) {
      outputValue = 0;
    }

    setOutputValue(outputValue);

    const minimumAmount = _.floor(outputValue * MIN_PERCENT);
    setMinimumAmount(minimumAmount);

    let outputText = formatUtils.amountFull(minimumAmount, outputToken.pDecimals);

    if (outputValue === 0 || minimumAmount === 0 || _.isNaN(minimumAmount)) {
      outputText = 0;
    }

    setOutputText(outputText.toString());

    // console.debug('TOKEN', inputToken.symbol, outputToken.symbol, outputToken.pDecimals, inputValue);
    // console.debug('PAIR', pair, pair[inputToken.id], pair[outputToken.id]);
    // console.debug('RESULT', outputValue, minimumAmount, outputText, outputValue === 0 || minimumAmount === 0 || isNaN(outputText));
  };

  React.useEffect(() => {
    if (inputToken && outputToken && inputValue) {
      calculateOutputValue();
    }

    if (!inputValue) {
      setOutputValue(0);
      setOutputText(0);
      setMinimumAmount(0);
    }
  }, [inputToken, inputValue, outputToken, pair]);

  React.useEffect(() => {

  }, [inputToken, inputValue]);

  return (
    <WrappedComp
      {...{
        ...props,
        outputValue,
        outputText,
        minimumAmount,
      }}
    />
  );
};

export default withCalculateOutput;

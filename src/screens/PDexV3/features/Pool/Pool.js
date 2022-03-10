import { Row } from '@src/components';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  actionToggleFollowingPool,
  getDataByPoolIdSelector,
} from '@screens/PDexV3/features/Pools';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from '@src/components/core';
import { BtnStar } from '@src/components/Button';
import TwoTokenImage from '@screens/PDexV3/features/Portfolio/Portfolio.image';
import { colorsSelector } from '@src/theme';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { styled } from './Pool.styled';

export const PoolItem = React.memo((props) => {
  const { poolId, onPressPool, style, isLast } = props;
  const data = useDebounceSelector(getDataByPoolIdSelector)(poolId);
  const colors = useDebounceSelector(colorsSelector);
  if (!data) {
    return null;
  }
  const {
    isFollowed,
    poolTitle,
    apyStr,
    token1,
    token2
  } = data || {};

  const dispatch = useDispatch();
  const handleToggleFollowingPool = () =>
    dispatch(actionToggleFollowingPool(poolId));
  return (
    <TouchableOpacity
      onPress={() => typeof onPressPool === 'function' && onPressPool(poolId)}
      style={[styled.container, { borderBottomWidth: 1, borderBottomColor: colors.border4 }, isLast && { marginBottom: 70, borderBottomWidth: 0 }, style]}
    >
      <Row centerVertical>
        <TwoTokenImage iconUrl1={token1.iconUrl} iconUrl2={token2.iconUrl} />
        <View style={styled.block1}>
          <Row style={styled.rowName} centerVertical>
            <Text style={styled.name}>{poolTitle}</Text>
          </Row>
          <Text style={[styled.network, { backgroundColor: colors.secondary }]}>{`${token1.networkName} / ${token2.networkName}`}</Text>
        </View>
        <View style={styled.block2}>
          <Text style={styled.subText}>{`${apyStr}`}</Text>
        </View>
        <View style={styled.block3}>
          <BtnStar onPress={handleToggleFollowingPool} isBlue={isFollowed} />
        </View>
      </Row>
    </TouchableOpacity>
  );
});

const Pool = (props) => {
  const { poolId, onPressPool, isLast } = props;
  if (!poolId) {
    return null;
  }
  return <PoolItem poolId={poolId} onPressPool={onPressPool} isLast={isLast} />;
};

Pool.defaultProps = {
  onPressPool: null,
  isLast: false,
};

Pool.propTypes = {
  poolId: PropTypes.string.isRequired,
  onPressPool: PropTypes.func,
  isLast: PropTypes.bool,
};

PoolItem.defaultProps = {
  onPressPool: null,
  style: null,
};

PoolItem.propTypes = {
  poolId: PropTypes.string.isRequired,
  onPressPool: PropTypes.func,
  style: PropTypes.object,
  isLast: PropTypes.bool.isRequired
};

export default React.memo(Pool);

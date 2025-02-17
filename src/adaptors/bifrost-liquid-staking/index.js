const sdk = require('@defillama/sdk');
const axios = require('axios');
const utils = require("../utils");

const token = '0xc3d088842dcf02c13699f936bb83dfbbc6f721ab';
const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const getApy = async () => {
  const tvl =
    (await sdk.api.erc20.totalSupply({ target: token })).output / 1e18;

  const apyData = (await axios.get('https://api.bifrost.app/api/site')).data;
  const priceKey = `ethereum:${weth}`;
  const ethPrice = (
    await axios.get(`https://coins.llama.fi/prices/current/${priceKey}`)
  ).data.coins[priceKey]?.price;

  const vToken = await utils.getData(
    'https://api.bifrost.app/api/site'
  );

  const dotUsd = (
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd'
    )
  ).data.polkadot.usd;


  const ksmUsd = (
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd'
    )
  ).data.kusama.usd;

  const bncUsd = (
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bifrost&vs_currencies=usd'
    )
  ).data.bifrost.usd;

  const glmrUsd = (
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=moonbeam&vs_currencies=usd'
    )
  ).data.moonbeam.usd;

  const movrUsd = (
    await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=moonriver&vs_currencies=usd'
    )
  ).data.moonriver.usd;

  const vDOT = {
    pool: 'polkadot-vdot',
    chain: 'Polkadot',
    project: 'bifrost-liquid-staking',
    symbol: 'vDOT',
    tvlUsd: vToken.vDOT.tvm * dotUsd,
    apyBase: Number(vToken.vDOT.apy),
  };

  const vGLMR = {
    pool: 'moonbeam-vglmr',
    chain: 'Moonbeam',
    project: 'bifrost-liquid-staking',
    symbol: 'vGLMR',
    tvlUsd: vToken.vGLMR.tvm * glmrUsd,
    apyBase: Number(vToken.vGLMR.apy),
  };

  const vMOVR = {
    pool: 'moonriver-vmovr',
    chain: 'Moonriver',
    project: 'bifrost-liquid-staking',
    symbol: 'vMOVR',
    tvlUsd: vToken.vMOVR.tvm * movrUsd,
    apyBase: Number(vToken.vMOVR.apy),
  };

  const vBNC = {
    pool: 'bifrost-vbnc',
    chain: 'Bifrost',
    project: 'bifrost-liquid-staking',
    symbol: 'vBNC',
    tvlUsd: vToken.vBNC.tvm * bncUsd,
    apyBase: Number(vToken.vBNC.apy),
  };

  const vKSM = {
    pool: 'kusama-vksm',
    chain: 'Kusama',
    project: 'bifrost-liquid-staking',
    symbol: 'vKSM',
    tvlUsd: vToken.vKSM.tvm * ksmUsd,
    apyBase: Number(vToken.vKSM.apy),
  };

  return [
    {
      pool: token,
      chain: 'ethereum',
      project: 'bifrost-liquid-staking',
      symbol: 'veth',
      tvlUsd: tvl * ethPrice,
      apyBase: apyData['vETH'].stakingApy,
      underlyingTokens: [weth],
    },
    vDOT, vGLMR, vMOVR, vKSM, vBNC
  ];
};

module.exports = {
  timetravel: false,
  apy: getApy,
  url: 'https://bifrost.app/vstaking',
};

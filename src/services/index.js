import axios from 'axios';

const thickerURL = 'https://poloniex.com/public?command=returnTicker';
const tradeHistoryURL = 'https://poloniex.com/public?command=returnTradeHistory&currencyPair=';
const loanOrdersURL = 'https://poloniex.com/public?command=returnLoanOrders&currency=';

export const fetchCryptoData = async () => (axios.get(thickerURL));

export const fetchTradeHistory = async (coinPair) => (axios.get(`${tradeHistoryURL}${coinPair}`));

export const fetchLoanOrders = async (coin) => (axios.get(`${loanOrdersURL}${coin}`));

import { fetchCryptoData, fetchTradeHistory, fetchLoanOrders } from '../services';

export const REQUEST_POLONIEX_API = 'REQUEST_POLONIEX_API';
export const RECEIVE_POLONIEX_API_SUCCESS = 'RECEIVE_POLONIEX_API_SUCCESS';
export const RECEIVE_POLONIEX_API_FAILURE = 'RECEIVE_POLONIEX_API_FAILURE';
export const FILTER_BY_NAME = 'FILTER_BY_NAME';
export const SORT_TABLE = 'SORT_TABLE';
export const RECEIVE_LOAN_ORDERS = 'RECEIVE_LOAN_ORDERS';
export const RECEIVE_TRADE_HISTORY = 'RECEIVE_TRADE_HISTORY';

const requestPoloniexAPI = () => ({
  type: REQUEST_POLONIEX_API,
});

const receivePoloniexAPISuccess = (data) => ({
  type: RECEIVE_POLONIEX_API_SUCCESS,
  data,
});

const receivePoloniexAPIFailure = (error) => ({
  type: RECEIVE_POLONIEX_API_FAILURE,
  error,
});

const receiveLoanOrdersAPISuccess = (data) => ({
  type: RECEIVE_LOAN_ORDERS,
  data,
});

const receiveHistoryTradeSuccess = (data) => ({
  type: RECEIVE_TRADE_HISTORY,
  data,
});

export const getCryptoDataFromAPI = () => async (dispatch) => {
  dispatch(requestPoloniexAPI());

  return fetchCryptoData()
    .then(({ data }) => {
      const filteredDataUSDT = Object.entries(data)
        .sort(([, a], [, b]) => b.last - a.last)
        .reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, []);

      dispatch(receivePoloniexAPISuccess(filteredDataUSDT));
    })
    .catch((error) => dispatch(receivePoloniexAPIFailure(error)));
};

export const filterByName = (data, name) => {
  const filteredData = Object.entries(data)
    .filter(([key, _value]) => key.match(name))
    .reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, []);
  return {
    type: FILTER_BY_NAME,
    filteredData,
    name,
  };
};

export const sortContent = (data, field, order) => {
  const operator = order === 'ASC' ? 1 : -1;
  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => operator * (a[field] - b[field]))
    .reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, []);
  return {
    type: SORT_TABLE,
    data: sortedData,
    field,
    order,
  };
};

export const getLoanOrders = (coin) => async (dispatch) => (
  fetchLoanOrders(coin)
    .then(({ data }) => dispatch(receiveLoanOrdersAPISuccess(data)))
    .catch((error) => dispatch(receivePoloniexAPIFailure(error)))
);

export const getTradeHistory = (coinPair) => async (dispatch) => {
  dispatch(requestPoloniexAPI());

  return fetchTradeHistory(coinPair)
    .then(({ data }) => dispatch(receiveHistoryTradeSuccess(data)))
    .catch((error) => dispatch(receivePoloniexAPIFailure(error)));
};

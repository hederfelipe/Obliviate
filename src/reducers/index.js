import {
  REQUEST_POLONIEX_API,
  RECEIVE_POLONIEX_API_SUCCESS,
  RECEIVE_POLONIEX_API_FAILURE,
  FILTER_BY_NAME,
  SORT_TABLE,
  RECEIVE_TRADE_HISTORY,
  RECEIVE_LOAN_ORDERS,
} from '../actions';

const INITIAL_STATE = {
  isFetching: false,
  data: {},
  filteredData: {},
  filters: {
    name: '',
    field: 'last',
    order: 'DESC',
  },
  tradeHistory: [],
  loanOrders: {},
  error: '',
};

const cryptoData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_POLONIEX_API:
      return { ...state, isFetching: true };
    case RECEIVE_POLONIEX_API_SUCCESS:
      return { ...state, isFetching: false, data: action.data };
    case RECEIVE_POLONIEX_API_FAILURE:
      return { ...state, isFetching: false, error: action.error.toString() };
    case FILTER_BY_NAME:
      return {
        ...state,
        filteredData: action.filteredData,
        filters: { ...state.filters, name: action.name },
      };
    case SORT_TABLE:
      return {
        ...state,
        filteredData: action.data,
        filters: { ...state.filters, field: action.field },
      };
    case RECEIVE_TRADE_HISTORY:
      return { ...state, isFetching: false, tradeHistory: action.data };
    case RECEIVE_LOAN_ORDERS:
      return { ...state, isFetching: false, loanOrders: action.data };
    default: return state;
  }
};

export default cryptoData;

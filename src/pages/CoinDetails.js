import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatCoinName } from '../utils';
import { getTradeHistory, getCryptoDataFromAPI } from '../actions';
import '../styles/coinDetails.css';
import LoanOrders from '../components/LoanOrders';

class CoinDetails extends Component {
  constructor(props) {
    super(props);

    const { location: { pathname } } = this.props;

    this.state = {
      coin: pathname.substring(1).toUpperCase(),
      coinPair: '',
    };
  }

  componentDidMount() {
    const { fetchCryptoData } = this.props;
    fetchCryptoData();
  }

  render() {
    const { coin, coinPair } = this.state;
    const { data, getPairTradeHistory, tradeHistory, isFetching, error } = this.props;

    if (isFetching) return <div className="spinner" data-testid="loading" />;

    if (error) return <p>Erro na conexão com a API. Verifique sua conexão.</p>;

    return (
      <section>
        <h2>{formatCoinName(coin)}</h2>
        <h3>Ordens de empréstimo</h3>
        <LoanOrders />
        <h3>Histórico de Negociações</h3>
        <section className="selector-tradre-history">
          <span className="selector-label">
            Selecione uma criptomoeda para ver o histórico de negociações entre as duas:
          </span>
          <select
            name="coin"
            onChange={({ target: { value } }) => this.setState({ coinPair: `${value}` })}
          >
            <option value="" label="Selecionar" />
            {Object.keys(data).filter((el) => el.startsWith(`${coin}_`))
              .map((key) => <option value={key} key={key}>{key.replace(`${coin}_`, '')}</option>)}
          </select>
          <button
            type="button"
            className="button-trade-history"
            onClick={() => getPairTradeHistory(coinPair)}
            disabled={!coinPair}
          >
            Exibir
          </button>
          <p>{coinPair.replace('_', ' to ')}</p>
          {tradeHistory.slice(0, 5).map((el, i) => (
            <pre key={el.tradeID}>{`${i + 1}. ${JSON.stringify(el, null, 4)}`}</pre>
          ))}
        </section>
      </section>
    );
  }
}

const mapStateToProps = ({
  data, tradeHistory, isFetching, error,
}) => ({
  data, tradeHistory, isFetching, error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCryptoData: () => dispatch(getCryptoDataFromAPI()),
  getPairTradeHistory: (coinPair) => dispatch(getTradeHistory(coinPair)),
});

CoinDetails.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  fetchCryptoData: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  tradeHistory: PropTypes.instanceOf(Array).isRequired,
  getPairTradeHistory: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

CoinDetails.defaultProps = {
  error: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinDetails);

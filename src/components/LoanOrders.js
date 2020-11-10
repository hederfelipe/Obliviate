import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLoanOrders } from '../actions';

class LoanOrders extends Component {
  constructor(props) {
    super(props);

    const { location: { pathname } } = this.props;

    this.state = {
      coin: pathname.substring(1).toUpperCase(),
    };
  }

  componentDidMount() {
    const { coin } = this.state;
    const { getCoinLoanOrders } = this.props;
    getCoinLoanOrders(coin);
  }

  render() {
    const { loanOrders, isFetching } = this.props;

    if (isFetching || !Object.getOwnPropertyNames(loanOrders).length) {
      return <div className="spinner" data-testid="loading" />;
    }

    const offersAvgAmount = loanOrders.offers
      .reduce((acc, cur, _i, arr) => (acc + Number(cur.amount)) / arr.length, 0);
    const offersAvgRate = loanOrders.offers
      .reduce((acc, cur, _i, arr) => (acc + Number(cur.rate)) / arr.length, 0);

    return (
      <section>
        <ul>
          Oferta:
          <li>
            Taxa de juros média (por dia):&nbsp;
            {offersAvgRate}
            %
          </li>
          <li>
            Número total de unidades disponíveis (média):&nbsp;
            {offersAvgAmount}
          </li>
        </ul>
      </section>
    );
  }
}

const mapStateToProps = ({ loanOrders, isFetching }) => ({ loanOrders, isFetching });

const mapDispatchToProps = (dispatch) => ({
  getCoinLoanOrders: (coin) => dispatch(getLoanOrders(coin)),
});

LoanOrders.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  getCoinLoanOrders: PropTypes.func.isRequired,
  loanOrders: PropTypes.instanceOf(Object).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoanOrders));

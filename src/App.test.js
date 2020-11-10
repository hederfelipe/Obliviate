import React from 'react';
import {
  render, fireEvent, wait, waitForElementToBeRemoved,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import * as axios from 'axios';
import mockAxios from 'axios';
import store from './store';
import App from './App';
import APIMock from './mocks/poloniexThickerMock';
import fetchCryptoData from './services';

jest.mock('axios');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('testing main page fixed elements', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  it('testing main page title', () => {
    expect(getByText(/Crypto/i)).toBeInTheDocument();
    expect(getByText(/Table/i)).toBeInTheDocument();
  });

  it('testing main page logo', () => {
    const { getByAltText } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(getByAltText(/ícone com três moedas sem preenchimento empilhadas/i)).toBeInTheDocument();
  });
});

describe('testing fetching table', () => {
  it('testing API call', async () => {
    axios.get.mockReturnValueOnce({ data: APIMock });

    const APICall = await fetchCryptoData();

    expect(APICall).toMatchObject({ data: APIMock });
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith('https://poloniex.com/public?command=returnTicker');
  });

  it('testing fetching animation', async () => {
    axios.get.mockReturnValueOnce({ data: APIMock });
    const { queryByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    await waitForElementToBeRemoved(() => queryByTestId('loading'));
  });

  it('testing table results', async () => {
    axios.get.mockReturnValueOnce({ data: APIMock });
    const { findByText } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    await findByText('BTC');
  });

  it('testing API error', async () => {
    axios.get.mockRejectedValue({ error: 'Erro na conexão com a API. Verifique sua conexão' });
    const { queryByText, queryByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(queryByText(/Erro na conexão com a API. Verifique sua conexão/i)).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => queryByTestId('loading'));
    expect(queryByText(/Erro na conexão com a API. Verifique sua conexão/i)).toBeInTheDocument();
  });
});

describe('testing filter fields', () => {
  it('testing search input', async () => {
    axios.get.mockReturnValueOnce({ data: APIMock });
    const { queryByText, getByPlaceholderText, findByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    await findByPlaceholderText(/digite um nome/i);
    fireEvent.change(getByPlaceholderText(/digite um nome/i), { target: { value: 'bc' } });
    await expect(getByPlaceholderText(/digite um nome/i).value).toBe('bc');
    await wait();
    expect(queryByText('BCHSV')).toBeInTheDocument();
    expect(queryByText('BTC')).not.toBeInTheDocument();
  });
});

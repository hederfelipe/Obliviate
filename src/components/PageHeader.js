import React from 'react';
import coinIcon from '../images/icons8-malha-100.png';

const PageHeader = () => (
  <header className="header">
    <img
      src={coinIcon}
      className="coin-icon"
      alt="ícone com três moedas sem preenchimento empilhadas"
    />
    <a href="/" className="header-link">
      <h1 className="header-title">
        Obliviate
        <span style={{ color: '#004AA0' }}></span>
      </h1>
    </a>
  </header>
);

export default PageHeader;

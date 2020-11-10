import React from 'react';
import githubIcon from '../images/icons8-malha-100.png';


const Footer = () => (
  <footer>
    <p className="footer-text">
      Obliviate
    </p>
    <a href="https://github.com/hederfelipe" target="_blank" rel="noopener noreferrer">
      <img src={githubIcon} sizes="900px" alt="ícone do github" className="footer-git-image" />
    </a>

    
    
  </footer>
);

export default Footer;

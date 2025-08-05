import React from 'react';

const Footer = () => {
  return (
    <footer className="footer animate-fade-in-up">
      <div className="footer__content">
        <div className="footer__grid md:flex md:justify-between md:items-center">
          <div className="footer__copyright">
            © 2024 ESQM (DLIFE) • All rights reserved
          </div>
          <div className="footer__links">
            <a href="#" className="footer__link hover-lift">
              Privacy Policy
            </a>
            <span className="footer__separator">•</span>
            <a href="#" className="footer__link hover-lift">
              Terms of Service
            </a>
            <span className="footer__separator">•</span>
            <a href="#" className="footer__link hover-lift">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
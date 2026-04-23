/* global React */
function Footer({ onCTA }) {
  return (
    <footer className="footer container">
      <div className="footer__layout">
        <p>© 2026 Mysterium Tech Portal</p>
        <nav>
          <a onClick={() => onCTA("GhostOfSecretum")}>@GhostOfSecretum</a>
          <a onClick={() => onCTA("SecretumHelp_bot")}>@SecretumHelp_bot</a>
          <a onClick={() => onCTA("GhostOfSecretum")}>Связаться</a>
        </nav>
      </div>
    </footer>
  );
}
window.Footer = Footer;

import { Link, Outlet } from 'react-router-dom'; 
// Link - en forbedret versjon av a href for å tilrettelegge for client side navigasjon
// Outlet - rendrer matchende child route fra en parent route, eller ingenting hvis ingen child route matcher
import Search from './Search';
// importerer jsx-komponent Search
import './Layout.css';
// importerer css til Layout.jsx

const Layout = ({ loggedInUser }) => {
  // loggedInUser som prop, hentet inn fra App.jsx. App eier state
  return (
    // <div>  Fjern unødvendig div (havner innenfor div id=root), erstattet med fragments for å markere innhold
    <>
      <header className="layout-header">
        <h1>Library system</h1>
        <Search />
        <p>
          Welcome,{' '}
          {/* {' '} lager et mellomrom etter Welcome */}
          {loggedInUser
            ? <Link to={`/borrower/${loggedInUser._id}`}>{loggedInUser.name}</Link>
            : 'No user loaded'}
            {/* fetchUser (i App.jsx) henter data fra database som lagres i loggedInUser - prop */}
            {/* basert på loggedInUser._id så skriver den ut loggedInUser.name som visning i JSX */}
        </p>
      </header>
      <nav className="layout-nav">
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/books">Books</Link>
        {' | '}
        <Link to="/orders">Orders</Link>
        {' | '}
        <Link to="/orders/new">New Order</Link>
      </nav>
      <main>
        <Outlet />
        {/* Outlet rendrer alle barne-elementer (alt innenfor Route Layout i App.jsx) */}
      </main>
      <footer className="layout-footer">
        <p><Link to="/privacy">Privacy</Link></p>
        {/* Siden eksisterer ikke. Viser show404.jsx */}
      </footer>
      </>
    // </div>
  );
};

export default Layout;

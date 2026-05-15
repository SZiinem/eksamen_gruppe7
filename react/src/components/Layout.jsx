import { Link, Outlet } from 'react-router-dom'; 
// Link - en forbedret versjon av a href for å tilrettelegge for client side navigasjon
// Outlet - rendrer matchende child route fra en parent route, eller ingenting hvis ingen child route matcher
import Search from './Search';
// importerer jsx-komponent Search
import './Layout.css';
import { useEffect, useState } from 'react';
// importerer css til Layout.jsx
import client from '../../helpers/sanityClient';
// IMPORTERER CLIENT FORDI VI SKAL HENTE FRA SANITY

const Layout = ({ loggedInUser, setLoggedInUser }) => {
  //SENDER 'setLoggedInUser' SOM PROPP, FORDI DEN KOMMER FRA ET ANNET KOMPONENT

  const [borrowers, setBorrowers] = useState([]);
  const [borrowerId, setBorrowerId] = useState('');
  const [error, setError] = useState(null);
  //EKSTRA

  useEffect(() => {
    const fetchData = async () => {
      setError(null) // EKSTRA
      try {
      const query = `{
        "borrowers": *[_type == "borrower"] | order(name asc){ _id, name }
      }`;
      const result = await client.fetch(query);
      setBorrowers(result.borrowers);
      } catch (err) { //EKSTRA
        setError(err.message) //EKSTRA
      }
    };
    fetchData();
  }, [setLoggedInUser]);
  // setLoggedInUser som prop, FOR Å HENTE AKTUELL BRUKER
  return (
    // <div> Fjernet unødvendig div (havner innenfor div id=root), erstattet med fragments for å markere innhold
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

        {/* LEGGER TIL SELECT OG OPTION FOR NEDTRYKKSMENYEN */}
        <select
          value={loggedInUser?._id || ''}
          onChange={(e) => {
          const selected = borrowers.find(b => b._id === e.target.value);
          setLoggedInUser(selected);
         }}>
              <option value="">— choose borrower —</option>
              {/* vises som standard når ingen borrower er valgt */}
              {borrowers.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
                // key={b._id} unik nøkkel som react trenger for listeelement
                // value={b._id} det som lagres i state
                // {b.name} mellom fragments viser borrower-navnet
              ))}
            </select>
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

import { Link, Outlet } from 'react-router-dom';
import Search from './Search';
import './Layout.css';

const Layout = ({ loggedInUser }) => {
  return (
    //fjern denne div-en v
    <div>
      <header className="layout-header">
        <h1>Library system</h1>
        <Search />
        <p>
          Welcome,{' '}
          {loggedInUser
            ? <Link to={`/borrower/${loggedInUser._id}`}>{loggedInUser.name}</Link>
            : 'No user loaded'}
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
        {/*placeholder som skal byttes med hvilken route man er på*/}
      </main>
      <footer className="layout-footer">
        <p><Link to="/privacy">Privacy</Link></p>
      </footer>
    </div>
  );
};

export default Layout;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const Orders = ({ loggedInUser }) => {
  // Orders med parameter loggedInUser fra App.jsx, prop (data) som sendes fra ett komponent inn til et annet komponent
  // forteller hvem som er logget inn, og hvilke ordre som skal vises. 
  // App eier state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loggedInUser) return; // lagt til ekstra kjøres ikke hvis bruker ikke er lastet inn enda
    const fetchOrders = async () => {
      try {
        // const query = `*[_type == "order"]{ gammel groq-spørring
        const query = `*[_type == "order" && borrower._ref == $userId]{
          _id,
          "borrowerId": borrower._ref,
          borrower->{name},
          books
        }`;
        // const result = await client.fetch(query); gammel kode
        const result = await client.fetch(query, {userId: loggedInUser._id});
        setOrders(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser]);
  // lagt til ekstra : avhengighetsarray

  // if (loading) return <div>Loading orders...</div>; erstattet div med p-tag
  if (loading) return <p>Loading orders...</p>;

  // if (error) return <div>Error: {error}</div>; erstattet div med p-tag
  if (error) return <p>Error: {error}</p>;

  return (
    // <div> erstattet div med tomme fragments
    <>
      <h1>Orders</h1>
      {/* <p><Link className="button" to="/orders/new">+ New order</Link></p> fjernet unødvendig p-tag fra lenke-knapp*/}
      <Link className="button" to="/orders/new">+ New order</Link>
      <ul>
        {orders.map((order) => {
          const isYours = loggedInUser && order.borrowerId === loggedInUser._id;
          return (
            <li key={order._id}>
              <Link to={`/orders/${order._id}`}>
                {/* <strong>Order #{order._id}</strong><br /> fjernet br-tag, erstattet med p-tag*/} 
                <p><strong>Order #{order._id}</strong></p>
              </Link>
              {order.borrower?.name || 'Unknown borrower'}
              {/* {isYours && <span className='yours' style={{ marginLeft: '0.5rem', color: 'green' }}>(yours)</span>} Fjernet inline CSS */}
              {isYours && <span className='yours'>(yours)</span>} 
              {' — '}
              {order.books?.length ?? 0} book{order.books?.length === 1 ? '' : 's'}
            </li>
          );
        })}
      </ul>

      </>
    // </div>
  );
};

export default Orders;

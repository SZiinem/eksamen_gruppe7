import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const query = 
        `*[_type == "order" && _id == $id]
        {_id, borrower->{name}, books[]->{title, author->{name}}, orderDate}[0]`;
        const result = await client.fetch(query, { id });

        if (!result) {
          throw new Error('Order not found');
          // Lager et nytt error‑objekt med meldingen "Order not found" og kaster det
          // når vi «kaster» (genererer) en feil inne i en try‑blokk, hopper koden rett til catch‑delen under
          // Alt etter throw inni try vil ikke kjøre. Poenget: Hvis ingen ordre ble funnet - ikke kalle setOrder, men behandle det som en feil.
        }

        setOrder(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // if (loading) return <div>Loading order details...</div>; erstattet div med p-tag
  if (loading) return <p>Loading order details...</p>;
  // if (error) return <div>Error: {error}</div>; erstattet div med p-tag
  if (error) return <p>Error: {error}</p>;

  return (
    // <div>
    <>
      {/* <h2 className="text-sm">Order #{order._id}</h2> text-sm finnes ingen steder. fjernet for å unngå forvirring */}
      <h2>Order #{order._id}</h2>
      <p><strong>Borrower:</strong> {order.borrower?.name || 'Unknown'}</p>
      {/* || bruker høyre side hvis venstre side er falsy (null, undefined, 0, "", false, NaN) */}
      {/* Burde fjerne strong fra "overskrift" (inkludere alt i p-tag). Strong forteller skjermleser og søkemotorer hva som er viktig informasjon */}
      <p><strong>Order date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</p>
      {/* Burde fjerne strong fra "overskrift" (inkludere alt i p-tag). Strong forteller skjermleser og søkemotorer hva som er viktig informasjon */}
      <p><strong>Books:</strong> {order.books?.length ?? 0}</p>
      {/* hvis order.books finnes tegnes det til skjer. Hvis ikke tegnes null */}
      {/* Burde fjerne strong fra "overskrift" (inkludere alt i p-tag). Strong forteller skjermleser og søkemotorer hva som er viktig informasjon */}
      <ul>
        {order.books?.map((book) => (
          <li key={book._id || book.title}>
            {/* key er en intern identifikator som react bruker for å identifisere objekter som er nye eller nylig endret */}
            {/* bruker enten bok_id eller bok.tittel for å finne riktig bok */}
            {book.title} by {book.author?.name ?? 'Unknown author'}
            {/* ?? bruker høyre side bare hvis venstre er null eller undefined */}
            {/* skriver ut tittel "by" forfatternavn eller ukjent forfatter */}
          </li>
        ))}
      </ul>
      <Link to="/orders">Back to orders</Link>
    </>
      // </div>
  );
};

export default Order;

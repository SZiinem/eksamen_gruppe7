import { useState, useEffect } from 'react';
import client from '../../helpers/sanityClient';

export default function Frontpage() {
  const [orders, setOrders] = useState([]);
  // useState([]) betyr at alle ordre som lages skal lagres i en array - array starter tom. 
  const [loading, setLoading] = useState(true);
  // Viser vente-tekst i jsx imens data hentes. Starter som true fordi app alltid starter med å hente data
  const [error, setError] = useState(null);
  // viser error hvis orders og loading ikke går som de skal - hindrer krasj fordi kode alltid kan fullføres

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const query = `*[_type == "order"]{books}`;
        const result = await client.fetch(query);
        setOrders(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // fjerner melding "Loading order statistics...", uansett om henting av data (try) eller (catch) fullføres 
      }
    };

    fetchSummary();
  }, []);

  const activeOrders = orders.length;
  // activeOrders går inn i Sanity-database, length teller antall i hver ordre
  const booksBorrowed = orders.reduce((count, order) => count + (order.books?.length || 0), 0);
  // orders.reduce(..) beregner hvor mange bøker som er lånt på tvers av alle ordre i listen. 
  // reduce(count, order) starter på 0 og legger til antall bøker til denne summen
  // order.books?.length ser på hver enkelt ordre og teller hvor mange elementer som finnes i books-listen
    // ? er en sikkerhetssjekk som gjør at koden returnerer undefined hvis den ikke finner noe - hindrer at koden krasjer
    // || 0 hvis order.books?.length er undefined (liste mangler) brukes tallet 0 i stedet. Det sikrer at man ikke prøver å plusse til noe som ikke er et tall (har en verdi)
  // , 0) forteller at reduce skal starte tellingen på 0

  return (
    // <div> Fjernet div. Erstattet med tom fragment
    <>
    {/* tom fragment for å fortelle react at "her kommer innhold" */}
      <h1>Welcome to the Library System</h1>
      <p>Explore our collection of books and manage your library experience.</p>

      <section>
        <h2>Order summary</h2>
        {loading ? (
          <p>Loading order statistics...</p>
        ) : error ? (
          <p>Error loading summary: {error}</p>
        ) : (
          // <div> Fjernet div - erstattet med article
          <article>
            <p>Active orders: {activeOrders}</p>
            <p>Books currently borrowed: {booksBorrowed}</p>
          </article>
          // </div> Fjernet div - erstattet med article
        )}
      </section>
      </>
    // </div> Fjernet div
  );
}
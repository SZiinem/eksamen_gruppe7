import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const BorrowerProfile = () => {
  const { id } = useParams();
  // useParams er en hook som henter dynamiske deler av URL, og returnerer et objekt som matcher. Eks: /user/:id, og URL er: user/5, så vil id være 5
  const [borrower, setBorrower] = useState(null);
  // useState(null) betyr at den starter med ingen verdi / ukjent
  const [orders, setOrders] = useState([]);
  // useState([]) starter med tom array, og vi forventer at orders skal være en liste senere
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrower = async () => {
      // async - vi skal hente noe fra sanity
      const query = `{
        "borrower": *[_type == "borrower" && _id == $id][0]{
          _id, name, email
        },

        // * vi søker på alt
        // [_type == "borrower" (vår parameter i sanity) && _id (sanity-generert id) == $id (fra vår const id tidligere i koden)][0] (index 0 - første i liste) 
        
        "orders": *[_type == "order" && borrower._ref == $id] | order(orderDate desc){

        // borrower._ref finner alle ordre som tilhører lånetaker med gitt id

          _id,
          orderDate,
          "books": books[]->{ _id, title, "author": author->name }
          // books fra schema order.jsx. viser _id, title, forfatter og forfatternavn
        }
      }`;
      const result = await client.fetch(query, { id });
      // henter data og sender til sanity som result, med søkeord/groq-spørring og id som parameter
      setBorrower(result.borrower);
      // oppdaterer borrower med data fra result
      setOrders(result.orders);
      // oppdaterer orders med ny data fra result
      setLoading(false);
    };
    fetchBorrower();
  }, [id]);
  // fetchBorrower kjører med [id] som avhengighet / dependency

  // if (loading) return <div>Loading borrower profile...</div>; Fjernet div
  if (loading) return <p>Loading borrower profile...</p>;

  // if (!borrower) return <div>Borrower not found.</div>; Fjernet div
  if (!borrower) return <p>Borrower not found.</p>;


  const allBooks = orders.flatMap(order => order.books || []);
  // orders er en liste med ordre
  // for hver order hentes order.books (eller [] hvis den ikke finnes)
  // flatMap slår sammen alle listene til ett flatt array. allBooks inneholder alle books fra alle orders i én array
  const uniqueBooks = Array.from(
    new Map(allBooks.map(book => [book._id, book])).values()
  );
  // allBooks.map(book => [book._id, book]) lager en liste med (nøkkel-id) par: [_id, book]
  // new Map(...) lager et Map-objekt hvor nøkkelen er book._id. hvis samme _id dukker opp flere ganger, overskrives den forrige – dermed blir hver _id unik.
  // .values() henter ut alle bok-objektene i Map-en (uten nøklene)
  // til slutt kjøres Array.from(..) gjør disse verdiene om til et vanlig array


  return (
    // <div>
    <>
      <h1>{borrower.name}</h1>
      {borrower.email && <p>{borrower.email}</p>}

      <h2>Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <Link to={`/orders/${order._id}`}>
                Order on {new Date(order.orderDate).toLocaleDateString()}
              </Link>
              {' — '}{order.books?.length ?? 0} book{order.books?.length === 1 ? '' : 's'}
            </li>
          ))}
        </ul>
      )}

      <h2>Books borrowed ({uniqueBooks.length})</h2>
      {uniqueBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <ul>
          {uniqueBooks.map(book => (
            <li key={book._id}>
              <Link to={`/books/${book._id}`}>{book.title}</Link>
              {book.author && ` — ${book.author}`}
            </li>
          ))}
        </ul>
      )}
      </>
    // </div>
  );
};

export default BorrowerProfile;

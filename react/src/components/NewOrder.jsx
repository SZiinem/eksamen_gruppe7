import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const NewOrder = () => {
  const navigate = useNavigate();

  const [borrowers, setBorrowers] = useState([]);
  const [books, setBooks] = useState([]);

  const [borrowerId, setBorrowerId] = useState('');
  // useState('') brukes fordi state er koblet til et input-felt (select i dette tilfellet) for å velge borrower
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null) // EKSTRA
      try {
      const query = `{
        "borrowers": *[_type == "borrower"] | order(name asc){ _id, name },
        "books": *[_type == "book"] | order(title asc){ _id, title, "author": author->name }
      }`;
      const result = await client.fetch(query);
      setBorrowers(result.borrowers);
      setBooks(result.books);
      } catch (err) { //EKSTRA
        setError(err.message) //EKSTRA
      }
    };
    fetchData();
  }, []);

  const toggleBook = (bookId) => {
    //Tar inn id til boken som blir valgt
    setSelectedBookIds(prev =>
      // oppdaterer state, prev = gjeldende liste
      prev.includes(bookId)
      // sjekker om boken allerede er i listen
        ? prev.filter(id => id !== bookId)
        // hvis ja - fjern den
        : [...prev, bookId]
        // hvis nei - legg den til
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // hindrer nettleser fra å laste på nytt (standard HTML skjema-oppførsel)
    setError(null);
    // nullstiller tidligere feilmeldinger

    if (!borrowerId) {
      setError('Please choose a borrower.');
      return;
      // stopper funksjonen hvis ingen borrower er valgt
    }
    if (selectedBookIds.length === 0) {
      setError('Please select at least one book.');
      return;
      // stopper funksjonen hvis ingen book er valgt
    }

    setSubmitting(true);
    // disabler submit-knapp imens vi venter - forhindre at samme ordre blir registrert flere ganger
    try {
      const newOrder = await client.create({
        _type: 'order',
      // dokument-type i sanity
        borrower: { _type: 'reference', _ref: borrowerId },
      // referanse til låner-dokument
        books: selectedBookIds.map(id => ({
      // array av bok-referanser
          // gjør om en liste til et format sanity forventer
          _type: 'reference',
          _ref: id,
          _key: crypto.randomUUID()
      // lager en unik nøkkel (som Sanity krever i arrays)
        })),
        orderDate: new Date().toISOString()
      // dato opprettet som: 2025-01-14T10:30:00.000Z
      });
      navigate(`/orders/${newOrder._id}`);
      // alt gikk bra - går til den nye ordre-siden
    } catch (err) {
      setError(err.message);
      // vis feilmelding hvis sanity-kall feiler
      setSubmitting(false);
      // skru av submitting så bruker kan sende skjema igjen
    }
  };
  // ikke nødvendig med catch eller finally - hvis alt går bra navigeres det bort fra siden, hvis ikke kan skjema sendes på nytt

  return (
    // <div>
    <>
      <h1>New order</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Borrower:{' '}
            <select
              value={borrowerId}
              onChange={(e) => setBorrowerId(e.target.value)}
              disabled={submitting}
            >
              <option value="">— choose borrower —</option>
              {borrowers.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </label>
        </p>

        <fieldset disabled={submitting}>
          <legend>Books</legend>
          {books.length === 0 ? (
            <p>Loading books…</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {books.map(book => (
                <li key={book._id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedBookIds.includes(book._id)}
                      onChange={() => toggleBook(book._id)}
                    />
                    {' '}{book.title}{book.author && ` — ${book.author}`}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create order'}
          </button>
        </p>
      </form>
      </>
    // </div>
  );
};

export default NewOrder;

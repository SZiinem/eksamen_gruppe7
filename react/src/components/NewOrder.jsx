import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const NewOrder = ({ loggedInUser }) => {
  //SENDT IN LOGGEDINUSER SOM PROP FOR Å KOBLE MED DROPDOWN MENYEN I LAYOUT
  const navigate = useNavigate();

  const [borrowers, setBorrowers] = useState([]);
  const [books, setBooks] = useState([]);


  // useState('') brukes fordi state er koblet til et input-felt (select i dette tilfellet) for å velge borrower
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  //const [borrowerId, setBorrowerId] = useState('');
  //SLETTET BORROWERID STATEN

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
    //ENDRET IFTESTEN FRA BORROWERID TIL LOGGEDINUSER
    if (!loggedInUser) {
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
        // dette er IKKE en fetch. Dette er "skjema" som sendes til Sanity som JS-kode
        _type: 'order',
        // dokument-type i sanity
        borrower: { _type: 'reference', _ref: loggedInUser._id }, //REFERENSE TIL LOGGEDINID/INNLOGGET PERSON
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
        // dato opprettet i format som sanity forstår som: 2025-01-14T10:30:00.000Z
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
  // ikke nødvendig med finally - hvis alt går bra navigeres det bort fra siden, hvis ikke kan skjema sendes på nytt setSubmitting(true)

  return (
    // <div>
    <>
      <h1>New order</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Borrower:{' '}
            {loggedInUser ? <span>{loggedInUser.name}</span> : 'No user loaded'}
          </label>
        </p>

        {/* SLETTET FORM/DROPDOWN MENYEN */}

        <fieldset disabled={submitting}>
          {/* deaktiverer alle elementer imens skjema sendes */}
          <legend>Books</legend>
          {/* Overskrift som vises på fieldset */}
          {books.length === 0 ? (
            <p>Loading books…</p>
            // vises imens bøker hentes fra database
          ) : (
            // <ul style={{ listStyle: 'none', padding: 0 }}> fjernet inline CSS. Lagt til i Layout.css
            <ul className='checkbox-neworder'>
              {books.map(book => (
                // pakker ut alle bøker i array
                <li key={book._id}>
                  {/* lister alle bøker som egne listepunkter, med checkbox */}
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedBookIds.includes(book._id)}
                      // viser om bok eksisterer i liste eller ikke
                      onChange={() => toggleBook(book._id)}
                    // hvis ja - nei, hvis nei - ja. 
                    />
                    {' '}{book.title}{book.author && ` — ${book.author}`}
                    {/* viser mellomrom, boktittel, sjekker om forfatternavn finnes - `${viser forfatternavn hvis det finnes}` */}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* {error && <p style={{ color: 'red' }}>{error}</p>} Fjernet inline CSS. Lagt til i Layout.css */}
        {error && <p className='error-neworder'></p>}

        {/* <p> fjernet unødvendig p-tag rundt button */}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create order'}
        </button>
        {/* </p> */}
      </form>
    </>
    // </div>
  );
};

export default NewOrder;

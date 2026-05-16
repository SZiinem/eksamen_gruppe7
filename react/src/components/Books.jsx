import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //EKSTRA: false er best for boolean-data (on/off), mens null er best for ukjent data
  const [showAvailableBooks, setShowAvailableBooks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // async tillater at vi bruker await senere i funksjonen - slik at koden ikke kjører før data er hentet, eller error er true
      try {
        const query = `{
          "books": 
          //spørring "books" søker på:
            *[_type == "book"]{
          //returnerer:
            _id,
            title,
            publishedYear,
            isbn,
            "author": author->name,
            "coverUrl": cover.asset->url,
          // coverUrl - bilde
            "genres": genres[]->{ _id, title },
            "borrowed": count(*[_type == "order" && references(^._id)]) > 0
          // ^._id betyr "den nåværende boken vi ser på"
          // references foran ^._id peker til boka med eksakt id
          // count(*[..] teller alle ordre mot en bok med en eksakt id

          //EKSTRA: | = pipe-operator, tar resultatet fra venstre side og sender det inn i en funksjon som data på høyre side
          } | order(author asc), //EKSTRA - order er for å sortere, som på SQL
          //  } | order(title asc), //gammel kode
          "genres": *[_type == "genre"] | order(title asc){ _id, title}
      // sorterer etter ordre og tittel, eldst - nyest
        }`;
        const result = await client.fetch(query);
        // venter på at client.fetch skal bli ferdig å hente data - resultat fra søkeord-> groq-spørring
        setBooks(result.books);
        // oppdaterer state books fra result
        setGenres(result.genres);
        // oppdaterer state genres fra result
      } catch (err) {
        setError(err.message);
        // catch (err) { setError(err.message); } hvis noe feiler i try-blokken (f.eks. nettverksfeil), lagres feilmeldingen i error-state. 
        // Innebygd feilmelding i JS
      } finally {
        setLoading(false);
        // finally - kjører alltid til slutt (enten det gikk bra eller ikke), og setter loading til false
      }
    };

    fetchData();
  }, []);
  // tom dependency - kjøres tom ved start (eller hvis man har slettet tidligere søkeord)

  // if (loading) return <div>Loading books...</div>; erstattet div med p
  if (loading) return <p>Loading books...</p>;

  // if (error) return <div>Error: {error}</div>; erstattet div med p
  if (error) return <p>Error: {error}</p>;

  // const filteredBooks = selectedGenre
  // // filteredBooks lager en liste filtrert på sjanger
  //   ? books.filter(book =>
  //     // hvis selectedGenre finnes (en sjanger er valgt), books.filter(...) tar bare med de bøkene der book.genres inneholder en sjanger med _id lik selectedGenre
  //       book.genres?.some(genre => genre._id === selectedGenre)
  //       // some sjekker om minst én sjanger i bokas liste matcher den sjangeren vi har valgt. Bøker kan ha 1 og flere sjangre
  //     )
  //   : books;
    // hvis selectedGenre ikke er satt, filteredBooks blir bare alle books (ingen filtrering)

  const filteredBooks = books
    .filter(book => selectedGenre ? book.genres?.some(genre => genre._id === selectedGenre) : true)
    .filter(book => showAvailableBooks ? !book.borrowed : true)

  return (
    // <div> fjernet div. erstattet med fragments
    <>
      <h1>Books</h1>

      <nav className="book-filters">
        <p>Filter:</p>
        <button
          onClick={() => {setSelectedGenre(null); setShowAvailableBooks(false);}}
          // setter selectedGenre til null - ingen sjanger valgt = vis alle
          // style={{ fontWeight: selectedGenre === null ? 'bold' : 'normal' }}
          className={selectedGenre === null ? 'active' : ''} // endret til
          // fjernet inline css, lagt til egen i Layout.css
        >
          All
        </button>
        {genres.map(genre => (
          // går gjennom alle sjangre og lager én <button> per sjanger
          <button
            key={genre._id}
            // kobler på en unik nøkkel for react
            onClick={() => { setSelectedGenre(genre._id); setShowAvailableBooks(false);}}
            // klikk på knappen setter selectedGenre til sjangerens id
            // style={{ fontWeight: selectedGenre === genre._id ? 'bold' : 'normal' }}
            className={selectedGenre === genre._id ? 'active' : ''} // endret til
            // fjernet inline css, lagt til egen i Layout.css
          >
            {genre.title}
          </button>
        ))}
      </nav>
      {/* EKSTRA: lagt til ny knapp som KUN viser de tilgjenlige bøkene! */}
        <p className="onlyAvailable">
          Show only available books {' '}
          <button
          //EKSTRA: setShowAvailableBooks starter som false, prev=>!prev snur tilstand til den motsatte altså til true, (hvis true - til false)
            onClick={() => setShowAvailableBooks(prev => !prev)}
            className={showAvailableBooks ? 'active' : ''}
            >
            Available only
          </button>
        </p>

      <ul>
        {filteredBooks.map((book) => (
          // lager én <li> per bok
          <li key={book._id} className='book-info'> 
          {/* lagt til className og ekstern css i Layout.css */}
            <img
              src={book.coverUrl || `https://placehold.co/40x60?text=${encodeURIComponent(book.title)}`}
              alt={`Cover of ${book.title}`}
              // style={{ width: 40, height: 60, objectFit: 'cover', verticalAlign: 'middle', marginRight: 8 }}
            />
            <Link to={`/books/${book._id}`}>
            {/* viser detaljer om boka */}
              <strong>{book.title}</strong>
              {/* strong er semantisk html som understreker viktig innhold for skjermlesere og søkemotorer */}
            </Link>{' '}
            {book.borrowed ? (
              // viser at om bok er lånt er den rød
              <span className='borrowed'>📕 Borrowed</span>
              // <span style={{ color: 'red', marginLeft: '0.5rem' }}>📕 Borrowed</span>
              // lagt css i eget ark, layout.css
            ) : (
              // hvis ikke lånt er den grønn
              <span className='available'>✅ Available</span>
              // <span style={{ color: 'green', marginLeft: '0.5rem' }}>✅ Available</span>
              // lagt css i eget ark, layout.css
            )}

            {/* <div> fjernet div, erstattet med <p>-tag */}
            <p>
              by {book.author} ({book.publishedYear}) - ISBN: {book.isbn}
              {book.genres?.length > 0 && (
                <span> — {book.genres.map(g => g.title).join(', ')}</span>
                // genereres som egne <li> i <ul>. Er meningsfull container? 
              )}
            </p>
            {/* </div> */}
          </li>
        ))}
      </ul>
      {/* EKSTRA: tekst dukker opp dersom det ikke er noen tilgjenlige bøker etter filtrering */}
      {filteredBooks.length === 0 ? <p>Ingen bøker tilgjengelig</p> : null}
      </>
    // </div>
  );
};

export default Books;

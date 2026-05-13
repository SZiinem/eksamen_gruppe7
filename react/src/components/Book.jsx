import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      // async tillater await senere i koden
      try {
        const query = `*[_type == "book" && _id == $id]{title, author->{name}, publishedYear, isbn, "coverUrl": cover.asset->url}[0]`;
        // Henter bok med type "book" og _id lik verdien av $id fra URL
        const result = await client.fetch(query, { id });
        // await venter på svar fra database

        if (!result) {
          // if (!result) betyr: «Hvis result er null, undefined eller en annen “falsy” verdi»
          throw new Error('Book not found');
          // Lager et nytt error‑objekt med meldingen "Book not found" og kaster det
          // når vi «kaster» en feil inne i en try‑blokk, hopper koden rett til catch‑delen under
          // Alt etter throw inni try vil ikke kjøre. Poenget: Hvis ingen bok ble funnet - ikke kalle setBook, men behandle det som en feil.
        }

        setBook(result);
        // kjører bare hvis result finnes (altså if (!result) var false)
        // setBook(result) oppdaterer React‑state book med bokdataene vi fant
        // etter dette vil komponenten rendres på nytt med book satt
      } catch (err) {
        // feil fra await client.fetch(...) (f.eks. nettverksfeil),
        // og feilen vi selv kastet med throw new Error('Book not found')
        setError(err.message);
        // setError(err.message) lagrer feilmeldingen i en egen state, typisk brukt til å vise noe sånt som: «Book not found» eller «Network error» i UI
      } finally {
        setLoading(false);
      }
    };
    // Flyt: 
    // Hent bok → lagres i result
    // Hvis result mangler → kast feil → gå til catch → lagre feilmelding → finally → loading = false
    // Hvis result finnes → setBook(result) → catch hoppes over → finally → loading = false

    fetchBook();
  }, [id]);

  // if (loading) return <div>Loading book details...</div>; erstattet div med p
  if (loading) return <p>Loading book details...</p>;

  // if (error) return <div>Error: {error}</div>; erstattet div med p
  if (error) return <p>Error: {error}</p>;

  return (
    // <div> fjernet div. erstattet med fragments
    <>
      <h1>{book.title}</h1>
      <img
        src={book.coverUrl || `https://placehold.co/240x360?text=${encodeURIComponent(book.title)}`}
        alt={`Cover of ${book.title}`}
        style={{ maxWidth: 240 }}
        // inline CSS? Burde vært i eget ark?
      />
      <p>
        <strong>Author:</strong> {book.author?.name || 'Unknown'}
        {/* inline CSS? Burde vært i eget ark? */}
      </p>
      <p>
        <strong>Published Year:</strong> {book.publishedYear || 'N/A'}
        {/* inline CSS? Burde vært i eget ark? */}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn || 'N/A'}
        {/* inline CSS? Burde vært i eget ark? */}
      </p>
      <Link to="/books">Back to book list</Link>
      </>
    // </div>
  );
};

export default Book;

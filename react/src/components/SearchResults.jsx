import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../../helpers/sanityClient';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  // ([]) sier at state starter med en tom array
  const [loading, setLoading] = useState(false);
  // (false) gjør at loading ikke starter med en gang koden kjøres, men skal kjøres og vises i tiden fra man trykker søk og til resultatet vises på siden
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) {
      // hvis q ikke finnes/oppfyller kriterier
      setResults([]); // er det lurt å kalle state i en effect? Vil ikke det skape rendering-trøbbel? hvis de kalles synkront?
      // så skal setResults tømmes / være tom
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null); // EKSTRA error ved feilet fetch
      // setter loading til true, siden koden skal kjøre en Groq-spørring for å hente data
      try {
      const query = `*[_type == "book" && (
        title match $term || author->name match $term
      )]{
        _id, title, "author": author->name, publishedYear
      } | order(title asc)`;
       // groq-spørring * søker på alt, og filtrerer treff på
       // _type - bøker, && title match ($term egendefinert parameter - søkeresultat) matcher tittel mot søkeresultat
       // || etter - sjekker om det vi søker på matcher navnet på forfatteren
       // author->name er tilsvarende som en join i SQL
       // order(title asc)` sorterer resultat ascending
       const data = await client.fetch(query, { term: `*${q}*` });
       // data tar imot fra query for å kunne lagre i state setResults(data)
       // q betyr kjør useEffect på nytt hver gang q endrer seg. (q endrer seg hver gang vi skriver nytt søkeord)
      setResults(data);
    } catch (err) { // EKSTRA 
      setError(err.message); // EKSTRA
      setResults([]) // EKSTRA 
    } finally { // EKSTRA 
      setLoading(false)
    }
      setResults([]);
      // søkeresultat oppdateres og lagres i state
      setLoading(false);
      // loading "slått av" etter data er hentet
    };
    fetchResults();
  }, [q]);
  // q som avhengighet / dependency 


  return (
    // <div> Fjernet div. Erstattet med tomme fragments
    <>
      <h1>Search results for "{q}"</h1>
      {loading ? (
        <p>Searching...</p>
      ) : error ? (
  <p>Something went wrong: {error}</p>
      ) : results.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {results.map(book => (
            <li key={book._id}>
              <Link to={`/books/${book._id}`}>{book.title}</Link>
              {book.author && ` — ${book.author}`}
              {book.publishedYear && ` (${book.publishedYear})`}
            </li>
          ))}
        </ul>
      )}
      </>
    // </div>
  );
};

export default SearchResults;

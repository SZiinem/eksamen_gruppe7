import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
  // useNavigate brukes for programmatisk navigasjon - via effekter eller brukerinput. Send brukeren til ny side
    // ved effekt (f.eks fullført order) - sendes tilbake til forrige side, eller neste side etter order() er ferdig
  // useSearchParams bruker en funksjon til å lese - og endre - søkeparametre i URL (det som kommer etter / i url-felt)

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [focused, setFocused] = useState(false)
  
  const savedHistory = () => {
  const stored = localStorage.getItem('searchHistory');
  return stored !== null ? JSON.parse(stored) : [];
};

  const [query, setQuery] = useState(searchParams.get('q') || '');
    // oppretter en state for et søkefelt, og lagrer det du har søkt på selv om man oppdaterer siden. Synkroniserer state med URL.
    // useState oppretter variabelen query (verdien) og setQuery (funksjonen for å kunne endre på verdien)
    // useState(searchParams.get('q') leser parameter fra adressefelt i nettleser
    // || brukes her som en fallback hvis det ikke står noe i adressefelt. Returnerer i dette tilfellet en tom tekststreng ''

  const [searchHistory, setSearchHistory] = useState(savedHistory);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //     // event.preventDefault() hindrer nettleseren i å utføre standard-oppdatering av nettsiden når data oppdateres - oppdaterer kun komponentet
  //   if (query.trim()) {
  //       // (query.trim()) sjekker at søkefeltet inneholder tekst. .trim fjerner mellomrom før/etter tekst
  //     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  //       // bruker useNavigate for å sende brukeren til en ny side
  //       // encodeURIComponent(query.trim())}`) endrer spesialtegn til lesbare verdier for Uniform Resource Identifier
  //   }
  // };
  //GAMMEL KODE UTEN LOCALSTORAGE

    // EKSTRA MED LOCALSTORAGE PÅ SØK - oppdaterer både state og localStorage når søk utføres
  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      const trimmed = query.trim();

      const updated = [trimmed, ...searchHistory.filter(q => q !== trimmed)].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      setSearchHistory(updated);

      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='searchform'>
      {/* onSubmit så man kan trykke enter og klikk på "Search". onClick er kun klikk på knapp */}
        {/* Kaller funksjonen som stopper siden fra å laste på nytt - preventDefault() */}
      <input
        type="text"
        value={query}
          // value={query} tvinger feltet til å alltid vise det som ligger i query-state. Hvis state endres, endres teksten
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
          // hver gang man trykker en tast fanges det opp og oppdaterer state. Nødvendig for å kunne skrive i søkefelt
        placeholder="Search books..."
      />
      <button type="submit">Search</button>
        {/* sender skjema */}

        {/* EKSTRA */}
        {/* {focused && searchHistory.length > 0} */}
        {focused && searchHistory.length > 0 && (
          <ul>
            {searchHistory.map((q, index) => (
              <li key={index}>
                <button type="button" onMouseDown={() => setQuery(q)}>{q}</button>
              </li>
            ))}
          </ul>
        )}
    </form>
  );
};

export default Search;

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  //navigerer deg til en side når noe er fullført uten at du trykker på en lenke
  const [searchParams] = useSearchParams();
  //leser og endrer søkeparameter i url-en etter ?. ^^^
  const [query, setQuery] = useState(searchParams.get('q') || '');
  //q = dersom det står noe i url-en etter search så finner den denne og skriver ut på søkefeltet
  // '' = tom streng, når url-en er tom så er søkefeltet tom

  const handleSubmit = (event) => {
    event.preventDefault();
    //preventDefault = sørger for at siden ikke refresher når vi sender inn skjema
    //query.trim() = Fjerner mellomrom før og etter søkeordet
    if (query.trim()) {
      //Sjekker at søkefeltet ikke er tomt — så du ikke søker på ingenting ^
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      //encodeURIComponent = bytter spesialtegn med verdi som er url-vennlig
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        //Hver gang brukeren skriver en bokstav, oppdateres query med det nye innholdet
        //e — selve hendelsen (event)
        //e.target — input-feltet
        //e.target.value — teksten som står i input-feltet
        placeholder="Search books..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;

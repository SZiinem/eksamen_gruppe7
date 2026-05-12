
import { useState, useEffect } from 'react'
// useState lagrer lokale endringer i verdier på siden. Hver gang man refresher siden vil de lagrede verdiene glemmes
// useEffect kjører en spesiell funksjon ved gitte anledninger. Enten når komponenten først åpnes, oppdateres eller brukes
  // kode som skjer -utenom- rendering, som å hente data, 
import './App.css'
import { Route, Routes } from 'react-router-dom'
import client from '../helpers/sanityClient'
import Frontpage from './components/Frontpage'
import Books from './components/Books'
import Book from './components/Book'
import Orders from './components/Orders'
import Order from './components/Order'
import Layout from './components/Layout'
import Show404 from './components/show404'
import BorrowerProfile from './components/BorrowerProfile'
import NewOrder from './components/NewOrder'
import SearchResults from './components/SearchResults'

function App() {
  // definerer/beskriver hva som skal skje i funksjonen App. tom () betyr at den kjøres uten dependencies/avhengigheter
  const [loggedInUser, setLoggedInUser] = useState(null)
  // const erklærer variabler som ikke skal tildeles nye verdier - konstante verdier/variabler/funksjoner
  // loggedInUser er en konstant referanse til den gjeldende state-verdien, og starter tom (som null - ingen brukere er hentet enda)
  // setLoggedInUser brukes for å endre på den tilhørende verdien loggedInUser. Forteller react at loggedInUser skal/kan endres

  useEffect(() => {
    // oppretter funksjonen useEffekt
    const fetchUser = async () => {
      // oppretter en asynkron funksjon fetchUser i selve effekten useEffect
      // async forteller at koden skal vente til data er hentet før den kjører videre
      try {
        // try er sikkerhetsmekanisme - prøver å kjøre kode
        const query = `*[_type == "borrower"][0]{ _id, name, email }`
        // Groq-spørring
        // *[_type == "borrower"] - finner alle dokumenter av typen "borrower"
        // [0] - tar bare det første treffet
        // { _id, name, email } - henter ut sanity-id, navn og epost
        const user = await client.fetch(query)
        // sender ovennevnte Groq-spørring til databasen
        // await gjør at koden venter til data er mottatt fra database
        // resultatet lagres i user
        setLoggedInUser(user)
        // setLoggedInUser(user) tar data hentet fra database og legger de i react-state (useState). Gjør at brukernavn og epost blir tilgjengelig for komponent og kan rendres. 
      } catch (error) {
        // hvis try ikke fungerer så kjøres catch med feilmelding i konsoll i stede for at appen krasjer
        console.error('Error fetching logged in user:', error)
        // error er en parameter i catch som tar imot feilobjekter
      }
    }
    fetchUser()
    // kjører funksjonen fetchUser
  }, []) 
  // [] betyr at den kun kjøres én gang - i dette tilfellet ved start. [] med innhold betyr at funksjonen skal kjøres avhengig av noe annet - depdendencies

  return (
    <Routes>
      <Route path="/" element={<Layout loggedInUser={loggedInUser} />}>
        <Route index element={<Frontpage />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<Book />} />
        <Route path="orders" element={<Orders loggedInUser={loggedInUser} />} />
        <Route path="orders/new" element={<NewOrder />} />
        <Route path="orders/:id" element={<Order />} />
        <Route path="borrower/:id" element={<BorrowerProfile />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="*" element={<Show404 />} />
      </Route>
    </Routes>
  )
}

export default App

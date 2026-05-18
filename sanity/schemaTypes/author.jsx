const author = {
  name: 'author', //intern id til dokumenttype
  title: 'Author', //navnet som vises i sanity
  type: 'document', //forteller at dette er et dokument
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required() //valideringsregel - "name" feltet kan ikke være tomt! Som: "NOT NULL" i SQL
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text'
    }
  ]
}

export default author
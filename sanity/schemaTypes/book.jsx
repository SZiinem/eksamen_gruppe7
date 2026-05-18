const book  = {
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }], //refererer til dokumentet author
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedYear',
      title: 'Published Year',
      type: 'number'
    },
    {
      name: 'isbn',
      title: 'ISBN',
      type: 'string'
    },
    {
      name: 'cover',
      title: 'Cover',
      type: 'image',
      options: { hotspot: true }
      //options: et objekt med tillegsinnnstillinger for et felt
      // hotspot: true : innstilling spesifikt for image. lar redaktøren velge et fokuspunkt på bildet
    },
    {
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'genre' }] }]
      //of: brukes inni en array, og sier hva slags ting som skal ligge i listen
      //hvert element er en lenke til genre-dokumentet
    }
  ]
}


export default book
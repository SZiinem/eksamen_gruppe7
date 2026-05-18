export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'borrower',
      title: 'Borrower',
      type: 'reference',
      to: [{ type: 'borrower' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'books',
      title: 'Books',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'book' }]
        }
      ],
      validation: Rule => Rule.min(1) //må inneholde minst 1 element
    },
    {
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  preview: { //preview bestemmer hvordan et dokument vises i sanity
  select: { //henter ut data fra dokumentet og gir dem navn
    borrower: "borrower.name",
    books: "books"
  },
  prepare({ borrower, books }) { //tar data fra select og bestemmer hva som skal vises
    return {
      title: `Order by ${borrower ?? "Unknown"}`,
      subtitle: `${books?.length || 0} books`
    };
  }
}

}

const { Client, TextField, NumericField, Query, GeoField } = require('./lib/index.js');
const client = new Client('myAddressBook');

async function main() {

    // Try to drop the 'myAddressBook' index if it already exists
    try {
        client.drop();
    } catch (err) {
        // Otherwise if it does exist log the error and continue
        console.error(err);
    }

    // Create a new index named 'myAddressBook' representing the schema 
    // for our address book that we will use to search off of
    await client.create(
        [
            new TextField('firstName', { weight: 5.0, sortable: true }),
            new TextField('lastName'),
            new GeoField('lastLocation'),
            new NumericField('age', { noIndex: true })
        ]
    );

    // Add 5 new people to our search index
    const addressBook = [
        {
            firstName: 'John',
            lastName: 'Smith',
            lastLocation: '15,-45',
            age: 20
        },
        {
            firstName: 'Big James',
            lastName: 'Smith',
            age: 50,
        },
        {
            firstName: 'Jane',
            lastName: 'Doe',
            age: 50,
        }
    ]
    await Promise.all(
        addressBook.map((person, uid) =>
            client.add(
                // A unique identifier that we can use for updating a person more efficiently
                uid,
                // Our custom fields we defined in our schema earlier
                {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    age: person.age
                }
            )
        )
    )

    const basicSearchResults = await client.search('Big');
    console.log('Basic Search Results:\n\n', basicSearchResults, "\n");

    const maxResults = 1;
    const query = new Query("smith").verbatim().paging(0, maxResults);
    const advancedSearchResults = await client.search(query);
    console.log(`
Advanced Search Query:

${query.getArgs().join(' ')}

Completed in ${advancedSearchResults.duration} milliseconds. Showing ${maxResults}/${advancedSearchResults.total} results:

${JSON.stringify(advancedSearchResults.docs,null,2)}
    `);

    // Now let's add a chinese person
    const newUID = addressBook.length + 1;
    await client.add(newUID,
        {
            firstName: '约翰',
            lastName: '工匠',
            age: 25,
        },
        {
            language: 'chinese'
        }
    );

    // Lets get his age using promises
    const chineseQuery = new Query('约翰')
        .language('chinese')
        .limitFields(['firstName'])
        .returnFields(['age']);

    client.search(chineseQuery)
        .then(results => {
            console.log("约翰's age is", results.docs[0].age, "\n");
        })
        .catch(err => {
            throw err;
        })
}

main()
    .catch(err => {
        console.error(err);
    });
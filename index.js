const Client = require('./src/RedisSearch').Client;

const client = new Client('doc1');

client.create([new Field('search')])
.then(client.search('doc1'))
.then((response) => {
    console.log(response);
})
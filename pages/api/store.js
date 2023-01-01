const { Client } = require('@elastic/elasticsearch');

const PPL_INDEX = 'people';

const client = new Client({
    cloud: { id: process.env.ESS_CLOUD_ID },
    auth: { 
        username: process.env.ESS_USERNAME,
        password: process.env.ESS_PASSWORD
     }
  });  //this is connected from the get go

export default async function store(req, res) {
    const people = await storeToESS(client, req.body)
}

export async function storeToESS (client, data) {
    // delete index, check if already exists
    const indexExists = await client.indices.exists({ index: PPL_INDEX });
    if (indexExists.body) {
        await client.indices.delete({ index: PPL_INDEX });
    }

    // create index and store data
    for (const person of data) {
        await client.index({
            index: PPL_INDEX,
            document: {
              name: person.name,
              email: person.email,
              label: person.label
            }
          });
    }

    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    await client.indices.refresh({ index: PPL_INDEX });
  
    const result = await client.search({
      index: PPL_INDEX,
    });
  
    return result.hits.hits;
}


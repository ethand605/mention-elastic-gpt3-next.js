const { Client } = require('@elastic/elasticsearch');

const PPL_INDEX = 'people';

const client = new Client({
    cloud: { id: process.env.ESS_CLOUD_ID },
    auth: { 
        username: process.env.ESS_USERNAME,
        password: process.env.ESS_PASSWORD
     }
  });  //this is connected from the get go

export default async function handler(req, res) {
    try{
        if (req.method==='POST'){
            await storeToESS(client, req.body);
            res.status(200).json({message: 'successfully stored people to elasticsearch'});
        } else if (req.method==='GET'){
            const result = await client.search({
                index: PPL_INDEX,
              });
            res.status(200).json(result.hits.hits);
        }   
    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
    
}

export async function storeToESS (client, data) {
    // delete index, check if already exists
    const indexExists = await client.indices.exists({ index: PPL_INDEX });
    if (indexExists) {
        console.log('deleting index');
        await client.indices.delete({ index: PPL_INDEX });
    }

    // create index and store data
    await client.indices.create({ index: PPL_INDEX });
    console.log('data', data);
    for (const person of data) {
        console.log('inserting', person);
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
}


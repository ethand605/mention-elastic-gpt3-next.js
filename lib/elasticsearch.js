import {Client} from "@elastic/elasticsearch";

export async function createElasticSearchClient(){
    const client = new Client({
        cloud: { id: process.env.ESS_CLOUD_ID },
        auth: { 
            username: process.env.ESS_USERNAME,
            password: process.env.ESS_PASSWORD
         }
      });
    
      return client;
}
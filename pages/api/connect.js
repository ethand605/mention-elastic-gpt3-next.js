import { createElasticSearchClient } from "../../lib/elasticsearch";

export default async function connect(req, res) {
    const client = await createElasticSearchClient();
    const { body } = await client.info()
    res.status(200).json({body});
}
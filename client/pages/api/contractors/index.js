import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const handler = async (req, res) => {
    const { method } = req;
    let id = req.query.id;
    const body = req.body;
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    switch (method) {
        case 'GET':
            try {
                await client.connect();

                // Get all contractor documents.
                const contractors = await client.db(process.env.MONGO_DB)
                    .collection('contractors')
                    .find().toArray();

                return res.status(200).json(contractors);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error connecting to db', details: error });
            }
            finally {
                client.close();
            }
            break;

        case 'POST':
            try {
                await client.connect();

                // Insert a new contractor document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('contractors')
                    .insertOne(body);
                
                console.log(result);

                return res.status(201).json(result.ops);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error connecting to db', details: error });
            }
            finally {
                client.close();
            }
            break;

        case 'PUT':
            try {
                await client.connect();

                // Update the specific contractor document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('contractors')
                    .updateOne(
                        { _id: new ObjectId(id) },
                        { $set: body }
                    );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'Contractor not found' });
                }

                return res.status(200).json(body);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error connecting to db', details: error });
            }
            finally {
                client.close();
            }
            break;

        case 'DELETE':
            try {
                await client.connect();

                // Delete the specific contractor document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('contractors')
                    .deleteOne(
                        { _id: new ObjectId(id) }
                    );

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Contractor not found' });
                }

                return res.status(200).json({ message: 'Contractor deleted' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error connecting to db', details: error });
            }
            finally {
                client.close();
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
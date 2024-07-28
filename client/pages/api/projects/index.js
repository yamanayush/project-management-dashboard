// import { MongoClient, ServerApiVersion } from 'mongodb';

// const handler = async (req, res) => {
//     const { method } = req;
//     const id = req.query.id;
//     const body = req.body;
//     const uri = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;

//     const client = new MongoClient(uri, {
//         serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//         }
//     });

//     try {
//         await client.connect();
//         const db = client.db(process.env.MONGO_DB);
//         const collection = db.collection('project');

//         switch (method) {
//             case 'GET':
//                 const projects = await collection.find().toArray();
//                 return res.status(200).json(projects);

//             case 'POST':
//                 const createResult = await collection.insertOne(body);
//                 return res.status(201).json(createResult.ops[0]);

//             case 'PUT':
//                 const updateResult = await collection.updateOne(
//                     { _id: new MongoClient.ObjectId(id) },
//                     { $set: body }
//                 );
//                 if (updateResult.matchedCount === 0) {
//                     return res.status(404).json({ error: 'Project not found' });
//                 }
//                 return res.status(200).json(body);

//             case 'DELETE':
//                 const deleteResult = await collection.deleteOne(
//                     { _id: new MongoClient.ObjectId(id) }
//                 );
//                 if (deleteResult.deletedCount === 0) {
//                     return res.status(404).json({ error: 'Project not found' });
//                 }
//                 return res.status(200).json({ message: 'Project deleted' });

//             default:
//                 res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//                 res.status(405).end(`Method ${method} Not Allowed`);
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error connecting to db', details: error });
//     } finally {
//         if (client) {
//             client.close();
//         }
//     }
// }

// export default handler;
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

                // Get all Project documents.
                const project = await client.db(process.env.MONGO_DB)
                    .collection('project')
                    .find().toArray();

                return res.status(200).json(project);
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

                // Insert a new Project document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('project')
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

                // Update the specific Project document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('project')
                    .updateOne(
                        { _id: new ObjectId(id) },
                        { $set: body }
                    );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'Project not found' });
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

                // Delete the specific Project document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('project')
                    .deleteOne(
                        { _id: new ObjectId(id) }
                    );

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                return res.status(200).json({ message: 'Project deleted' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error connecting to db', details: error });
            }
            finally {
                client.close();
            }
            break;

        case 'PATCH':
            try {
                await client.connect();

                // Update specific fields of the Project document.
                const result = await client.db(process.env.MONGO_DB)
                    .collection('project')
                    .updateOne(
                        { _id: new ObjectId(id) },
                        { $set: body }
                    );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'Project not found' });
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

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;
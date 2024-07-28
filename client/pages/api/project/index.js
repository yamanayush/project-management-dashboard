// pages/api/project.js
// Hello
import { MongoClient, ServerApiVersion } from 'mongodb';

const handler = async (req, res) => {
    if(req.method === 'GET') {
        const projectNumber = req.query.number;

        if(!projectNumber) {
            return res.status(400).json({ error: 'Missing "number" parameter' });
        }

        try {
            const uri = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;

            const client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });

            await client.connect();
            
            const project = await client.db(process.env.MONGO_DB)
                .collection('proj')
                .findOne({ "project.Project Number:": projectNumber });

            if(!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            return res.status(200).json(project);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error connecting to db', details: error });
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).json({message: `Method ${req.method} not allowed`})
    }  
}

export default handler;


// // pages/api/contractors.js
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

//     switch (method) {
//         case 'GET':
//             try {
//                 await client.connect();

//                 const contractors = await client.db(process.env.MONGO_DB)
//                     .collection('contractors')
//                     .find({})
//                     .toArray();

//                 return res.status(200).json(contractors);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Error connecting to db', details: error });
//             }
//             break;

//         case 'POST':
//             const { body } = req;
//             // validate body...
//             try {
//                 await client.connect();
        
//                 const result = await client.db(process.env.MONGO_DB)
//                     .collection('contractors')
//                     .insertOne(body);
        
//                 return res.status(201).json(result.ops[0]);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Error connecting to db', details: error });
//             }
//             break;
        
//         case 'PUT':
//             // validate body and id...
//             try {
//                 await client.connect();
        
//                 const result = await client.db(process.env.MONGO_DB)
//                     .collection('contractors')
//                     .findOneAndUpdate(
//                         { _id: id },
//                         { $set: body },
//                         { returnOriginal: false }
//                     );
        
//                 if (!result.value) {
//                     return res.status(404).json({ error: 'Contractor not found' });
//                 }
        
//                 return res.status(200).json(result.value);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Error connecting to db', details: error });
//             }
//             break;
            
//         case 'DELETE':
//             const { id } = req.query;
//             // validate id...
//             try {
//                 await client.connect();
        
//                 const result = await client.db(process.env.MONGO_DB)
//                     .collection('contractors')
//                     .findOneAndDelete({ _id: id });
        
//                 if (!result.value) {
//                     return res.status(404).json({ error: 'Contractor not found' });
//                 }
        
//                 return res.status(200).json(result.value);
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Error connecting to db', details: error });
//             }
//             break;
                
//         default:
//             res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//             res.status(405).end(`Method ${method} Not Allowed`);
//     }

//     if (client) {
//         client.close();
//     }
// }

// export default handler;
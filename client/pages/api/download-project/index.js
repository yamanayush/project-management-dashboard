import { MongoClient, ServerApiVersion, GridFSBucket } from 'mongodb';
import { ObjectId } from 'mongodb';
const archiver = require('archiver');

const handler = async (req, res) => {
    console.log("Received request", req.method, req.query);
    console.log(req.headers);
    if (req.method === 'GET') {
        const id = req.query.id; // project id
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            const db = client.db(process.env.MONGO_DB);

            // Get the project document
            const project = await db.collection('project').findOne({ _id: new ObjectId(id) });

            if (!project || !project.projFile || project.projFile.length === 0) {
                return res.status(404).json({ error: 'project or projFile not found' });
            }

            // Prepare the zip file
            const archiver = require('archiver');
            const zip = archiver('zip');
            zip.pipe(res);

            // Download each timesheet and add it to the zip file
            const bucket = new GridFSBucket(db, {
                bucketName: 'projFile'
            });
            for (const timesheetId of project.projFile) {
                const timesheetFile = await bucket.find({ _id: new ObjectId(timesheetId) }).next();

                if (!timesheetFile) {
                    console.error(`Timesheet file not found: ${timesheetId}`);
                    continue;
                }

                const downloadStream = bucket.openDownloadStream(new ObjectId(timesheetId));
                zip.append(downloadStream, { name: timesheetFile.filename });
            }

            // Finalize the zip file
            zip.finalize();

            // Close the MongoDB client when the download completes
            zip.on('end', () => {
                client.close();
            });

            zip.on('error', (error) => {
                console.error(error);
                return res.status(500).json({ error: 'Error creating zip file', details: error.message });
            });
        } catch (error) {
            console.error(error);
            client.close();
            return res.status(500).json({ error: 'Error connecting to db', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
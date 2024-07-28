import { MongoClient, ServerApiVersion, GridFSBucket } from 'mongodb';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';

const handler = async (req, res) => {
    console.log("Received request", req.method, req.query);
    console.log(req.headers);

    const id = req.query.id; // project id
    const fileId = req.query.fileId; // file id
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

        if (req.method === 'GET') {
            // Get the project document
            const project = await db.collection('contractors').findOne({ _id: new ObjectId(id) });

            if (!project || !project.timesheets || project.timesheets.length === 0) {
                return res.status(404).json({ error: 'project or projFile not found' });
            }

            // Fetch timesheet files information
            const bucket = new GridFSBucket(db, {
                bucketName: 'timesheets'
            });

            // If a fileId is provided, return the file contents
            if (fileId) {
                const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

                downloadStream.on('error', () => {
                    return res.status(404).json({ error: 'File not found' });
                });

                return downloadStream.pipe(res);
            }

            const timesheetFiles = [];
            for (const timesheetId of project.timesheets) {
                const timesheetFile = await bucket.find({ _id: new ObjectId(timesheetId) }).next();

                if (!timesheetFile) {
                    console.error(`Timesheet file not found: ${timesheetId}`);
                    continue;
                }

                timesheetFiles.push({
                    id: timesheetFile._id,
                    length: timesheetFile.length,
                    chunkSize: timesheetFile.chunkSize,
                    uploadDate: timesheetFile.uploadDate,
                    filename: timesheetFile.filename
                });
            }

            res.status(200).json(timesheetFiles);
        } else if (req.method === 'DELETE') {
            if (!fileId) {
                return res.status(400).json({ error: 'File id is missing' });
            }

            // Get the project document
            const project = await db.collection('contractors').findOne({ _id: new ObjectId(id) });

            if (!project || !project.timesheets.includes(fileId)) {
                return res.status(404).json({ error: 'project or projFile not found' });
            }

            // Delete the file
            const bucket = new GridFSBucket(db, {
                bucketName: 'timesheets'
            });

            await bucket.delete(new ObjectId(fileId));

            // Remove the fileId from the project's projFile array
            await db.collection('contractors').updateOne({ _id: new ObjectId(id) }, { $pull: { timesheets: fileId } });

            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.setHeader('Allow', ['GET', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        client.close();
        return res.status(500).json({ error: 'Error connecting to db', details: error.message });
    }
};

export default handler;
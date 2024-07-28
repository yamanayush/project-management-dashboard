// Server side upload code
import { MongoClient, ServerApiVersion, GridFSBucket } from 'mongodb';
import multer from 'multer';
import { ObjectId } from 'mongodb';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// A middleware function to handle multer uploading
const multerUploads = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single('timesheet')(req, res, (err) => {
            if (err) {
                return reject(err);
            }
            if (!req.file) {
                return reject(new Error('No file uploaded'));
            }
            return resolve();
        });
    });
};

const handler = async (req, res) => {
    console.log("Received request", req.method, req.query);
    console.log(req.headers);
    if (req.method === 'POST') {
        try {
            await multerUploads(req, res);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'Error uploading file', details: err.message });
        }

        const id = req.query.id; // contractor id
        const file = req.file; // file from multer

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

            // Upload the file to GridFS
            const bucket = new GridFSBucket(db, {
                bucketName: 'timesheets'
            });
            const uploadStream = bucket.openUploadStreamWithId(new ObjectId(), file.originalname, {
                metadata: {
                    originalName: file.originalname,
                },
            });
            uploadStream.end(file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', resolve);
                uploadStream.on('error', reject);
            });

            // Update the contractor document with a reference to the uploaded file
            const fileId = uploadStream.id.toString();
            const result = await db.collection('contractors').updateOne(
                { _id: new ObjectId(id) },
                { $push: { timesheets: fileId } } // push the new timesheet into the array
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Contractor not found' });
            }

            return res.status(200).json({ message: 'Timesheet uploaded', fileId });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error connecting to db', details: error.message });
        } finally {
            client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export const config = {
    api: {
        bodyParser: false, // Disabling Next.js's body parser allows multer to work.
    },
};

export default handler;

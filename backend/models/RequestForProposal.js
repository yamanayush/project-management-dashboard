const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let projectNumber = 1;

const RequestForProposalSchema = new Schema({
    projectNumber: { type: Number, default: () => projectNumber++ },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhoneNumber: { type: String, required: true },
    clientCompany: { type: String, required: true },
    clientAddress: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true, maxlength: 1000 },
    proposedStartDate: { type: Date },
    proposedEndDate: { type: Date },
    projectAttachments: { type: String }, // This will be a path to the stored file
    projectDisciplines: [{ type: String }]
});

module.exports = mongoose.model('RequestForProposal', RequestForProposalSchema);

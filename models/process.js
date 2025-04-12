const mongoose = require("mongoose");

const processFlowSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  steps: [
    {
      stepName: String,
      description: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProcessFlow = mongoose.model("ProcessFlow", processFlowSchema);
module.exports = ProcessFlow;

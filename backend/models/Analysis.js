// models/Analysis.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  prakriti: {
    primary: { type: String, required: true },
    secondary: { type: String }
  },
  traits: {
    type: Object,
    required: true
  },
  recommendations: {
    diet: {
      breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }],
      snacks: [{ type: String }],
      waterIntake: { type: String },
      fruits: [{ type: String }]
    },
    schedule: {
      morning: [{ type: String }],
      afternoon: [{ type: String }],
      evening: [{ type: String }],
      night: [{ type: String }]
    },
    followUp: [{ type: String }]
  },
  results: {
    score: { type: Number },
    details: { type: String }
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
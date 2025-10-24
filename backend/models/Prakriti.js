const mongoose = require('mongoose');

const prakritiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  traits: {
    skin: String,
    bodyBuild: String,
    hair: String,
    mindset: String,
    memory: String,
    emotions: String,
    diet: String,
    sleep: String,
    energy: String,
    weatherPreference: String,
    stressResponse: String,
  },prakriti: {
    primary: String,
    secondary: String,
  },
  recommendations: {
    diet: {
      breakfast: [String],
      lunch: [String],
      dinner: [String],
      snacks: [String],
      waterIntake: String,
      fruits: [String],
    },
    schedule: {
      morning: [String],
      afternoon: [String],
      evening: [String],
      night: [String],
    },
    followUp: [String],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prakriti', prakritiSchema);
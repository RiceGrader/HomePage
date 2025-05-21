import mongoose from 'mongoose';

const rice_analysis_schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  total_objects: { type: Number, required: true },
  full_grain_count: { type: Number, required: true },
  broken_grain_count: { type: Number, required: true },
  chalky_count: { type: Number, required: true },
  black_count: { type: Number, required: true },
  yellow_count: { type: Number, required: true },
  brown_count: { type: Number, required: true },
  stone_count: { type: Number, required: true },
  husk_count: { type: Number, required: true },
  broken_percentages: { type: mongoose.Schema.Types.Mixed },
  device_id: { type: String, required: true },
  timestamp: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const RiceAnalysis = mongoose.models.rice_analysis || 
  mongoose.model('rice_analysis', rice_analysis_schema, 'rice_analysis');

export default RiceAnalysis;


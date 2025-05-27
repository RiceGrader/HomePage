import mongoose from 'mongoose';
const dal_analysis_schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  total_objects: { type: Number, required: true },
  full_grain_count: { type: Number, required: true },
  broken_grain_count: { type: Number, required: true },
  broken_percentages: { type: mongoose.Schema.Types.Mixed },
  black_dal: { type: Number, required: true },
  device_id: { type: String, required: true },
  timestamp: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const DalAnalysis = mongoose.models.dal_analysis || 
  mongoose.model('dal_analysis', dal_analysis_schema, 'dal_analysis');

export default DalAnalysis;
import { Schema, model } from 'mongoose';

export interface ILog  {
  action: 'create' | 'delete' | 'update' | 'read';
  idNumber: string;
  message: string;
  timestamp: Date;
  meta?: Record<string, any>;
}

const LogSchema = new Schema<ILog>({
  action: { type: String, required: true },
  idNumber: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object },
});

const Log = model<ILog>('Log', LogSchema);
export default Log;

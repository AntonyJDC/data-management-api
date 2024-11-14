import { Schema, model, Document } from 'mongoose';

export interface IPersona extends Document {
  tipoDocumento: 'Tarjeta de identidad' | 'Cédula';
  nroDocumento: string;
  primerNombre: string;
  segundoNombre?: string;
  apellidos: string;
  fechaNacimiento: Date;
  genero?: 'Masculino' | 'Femenino' | 'No binario' | 'Prefiero no reportar';
  correo: string;
  celular: string;
  foto?: string;
}

const PersonaSchema = new Schema<IPersona>({
  tipoDocumento: { type: String, enum: ['Tarjeta de identidad', 'Cédula'], required: true },
  nroDocumento: { type: String, required: true, maxlength: 10 },
  primerNombre: { type: String, required: true, maxlength: 30 },
  segundoNombre: { type: String, maxlength: 30 },
  apellidos: { type: String, required: true, maxlength: 60 },
  fechaNacimiento: { type: Date, required: true },
  genero: { type: String, enum: ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'] },
  correo: { type: String, required: true, match: /.+\@.+\..+/ },
  celular: { type: String, required: true, length: 10 },
  foto: { type: String },
});

const Persona = model<IPersona>('Persona', PersonaSchema);
export default Persona;
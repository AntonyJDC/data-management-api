import { Schema, model } from 'mongoose';

export interface IUser {
  idType: 'Tarjeta de identidad' | 'Cedula';
  idNumber: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: Date;
  gender: 'Masculino' | 'Femenino' | 'No binario' | 'Prefiero no reportar';
  email: string;
  phone: string;
  photo?: string;
}

const UserSchema = new Schema<IUser>({
  idType: {
    type: String,
    required: [true, 'Tipo de documento es requerido'],
    enum: {
      values: ['Tarjeta de identidad', 'Cedula'],
      message: '{VALUE} no es un tipo de documento válido',
    },
  },
  idNumber: {
    type: Number,
    required: [true, 'Nro. de documento es requerido'],
    unique: true,
    min: [0, 'Número de documento mínimo es 0, se suministró {VALUE}'],
    max: [9999999999, 'Número de documento máximo es 9999999999, se suministró {VALUE}'],
  },
  firstName: {
    type: String,
    required: [true, 'Primer Nombre es requerido'],
    maxlength: [30, 'No se permiten nombres con más de 30 caracteres'],
    validate: {
      validator: (str: string) => isNaN(Number(str)),
      message: 'No se permiten números como nombres',
    },
  },
  middleName: {
    type: String,
    maxlength: [30, 'No se permiten nombres con más de 30 caracteres'],
    validate: {
      validator: (str: string) => str.length === 0 || isNaN(Number(str)),
      message: 'No se permiten números como nombres',
    },
  },
  lastName: {
    type: String,
    required: [true, 'Apellido es requerido'],
    maxlength: [60, 'No se permiten apellidos con más de 60 caracteres'],
    validate: {
      validator: (str: string) => isNaN(Number(str)),
      message: 'No se permiten números como apellidos',
    },
  },
  birthDate: {
    type: Date,
    required: [true, 'Fecha de Nacimiento es requerida'],
  },
  gender: {
    type: String,
    required: [true, 'Género es requerido'],
    enum: {
      values: ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'],
      message: '{VALUE} no es una opción de género válida',
    },
  },
  email: {
    type: String,
    required: [true, 'Correo electrónico es requerido'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, '{VALUE} no es un correo electrónico válido'],
  },
  phone: {
    type: String,
    required: [true, 'Celular es requerido'],
    match: [/^\d{10}$/, 'El número de celular debe tener exactamente 10 dígitos'],
  },
  photo: {
    type: String,
    validate: {
      validator: function (photo: string) {
        // Validar tamaño si la foto es un base64 o un archivo externo
        return !photo || Buffer.byteLength(photo, 'base64') <= 2097152;
      },
      message: 'El tamaño del archivo no puede superar los 2 MB',
    },
  },
});

const User = model<IUser>('User', UserSchema);
export default User;
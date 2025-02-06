import mongoose from 'mongoose';

const connectDB = () => {
    console.log('La Base de Datos fue Conectada con Éxito.');
    mongoose.connect('mongodb+srv://MalcomVeck:ErksInterWorld@malcomveck.n8lda.mongodb.net/?retryWrites=true&w=majority&appName=MalcomVeck')
}

export default connectDB;
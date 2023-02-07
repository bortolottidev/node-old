import mongoose from 'mongoose';

const uri = "mongodb+srv://asdiuhsauihduisahdsaiuhdiusah";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on('error', (err) => console.log('Cannot connect to MongoDB', err));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

export default mongoose;

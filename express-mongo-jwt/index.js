import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api';

const APP_NAME = 'CRM';
const PORT = process.env.PORT || 6000; 

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/api', apiRoutes);
app.get('/', (req, res) => res.send(APP_NAME));


app.listen(PORT, () => console.info(`${APP_NAME} is listening on port ${PORT}`));
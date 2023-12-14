import 'reflect-metadata';
import express from 'express';
const cors = require('cors');
import 'dotenv/config';

import {AppDataSource} from "./data-source";
import buyersRouter from './routes/buyersRoutes';
import vendorsRouter from './routes/vendorsRoutes';
import appointmentsRoutes from "./routes/AppointmentsRoutes";




// Initialize data source
AppDataSource.initialize().then(async () => {

    const app = express();
    const corsOptions = {
        origin: 'https://modaresa-appointments.netlify.app',
        optionsSuccessStatus: 200 // For legacy browser support
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    app.use('/buyers', buyersRouter);
    app.use('/vendors', vendorsRouter);
    app.use('/appointments', appointmentsRoutes);



  /*  app.post('/buyers', async (req, res) => {
        console.log(req.body)
        const buyerRepository = AppDataSource.getRepository(Buyer);
        const newBuyer = buyerRepository.create(req.body);
        await buyerRepository.save(newBuyer);
        res.status(201).send(newBuyer);
    });*/



    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });

}).catch(error => console.log('Error during Data Source initialization', error));

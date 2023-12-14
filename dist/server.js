"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors = require('cors');
require("dotenv/config");
const data_source_1 = require("./data-source");
const buyersRoutes_1 = __importDefault(require("./routes/buyersRoutes"));
const vendorsRoutes_1 = __importDefault(require("./routes/vendorsRoutes"));
const AppointmentsRoutes_1 = __importDefault(require("./routes/AppointmentsRoutes"));
// Initialize data source
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const corsOptions = {
        origin: 'https://modaresa-appointments.netlify.app',
        optionsSuccessStatus: 200 // For legacy browser support
    };
    app.use(cors(corsOptions));
    app.use(express_1.default.json());
    app.use('/buyers', buyersRoutes_1.default);
    app.use('/vendors', vendorsRoutes_1.default);
    app.use('/appointments', AppointmentsRoutes_1.default);
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
})).catch(error => console.log('Error during Data Source initialization', error));

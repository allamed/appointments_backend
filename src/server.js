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
const typeorm_1 = require("typeorm");
const Vendor_1 = require("./entities/Vendor");
const Buyer_1 = require("./entities/Buyer");
const Appointment_1 = require("./entities/Appointment");
// Define your data source
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: "postgres://uemytugwhnicax:0b6fcf2355d25b89e5c40c1ec37abf00dc9899773bd6363a987ac006d81923f3@ec2-3-210-173-88.compute-1.amazonaws.com:5432/d7r8j0neoqs835",
    synchronize: true, // Use only in development
    logging: true,
    entities: [Vendor_1.Vendor, Buyer_1.Buyer, Appointment_1.Appointment],
    // subscribers, and migrations can also be added here
});
// Initialize your data source
AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    // Express setup
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Vendor routes
    app.get('/vendors', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vendors = yield AppDataSource.manager.find(Vendor_1.Vendor);
        res.json(vendors);
    }));
    // ... additional routes for buyers and appointments
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})).catch(error => console.log('Error during Data Source initialization', error));

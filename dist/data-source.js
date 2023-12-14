"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Vendor_1 = require("./entities/Vendor");
const Buyer_1 = require("./entities/Buyer");
const Appointment_1 = require("./entities/Appointment");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    synchronize: true, // Use only in development
    logging: true,
    entities: [Vendor_1.Vendor, Buyer_1.Buyer, Appointment_1.Appointment],
    url: process.env.DATABASE_URL, // Use the environment variable
    ssl: {
        rejectUnauthorized: false
    },
});

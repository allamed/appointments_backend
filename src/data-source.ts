import {DataSource} from "typeorm";
import {Vendor} from "./entities/Vendor";
import {Buyer} from "./entities/Buyer";
import {Appointment} from "./entities/Appointment";

export const AppDataSource = new DataSource({

    type: "postgres",
    synchronize: true, // Use only in development
    logging: true,
    entities: [Vendor, Buyer, Appointment],

    url: process.env.DATABASE_URL, // Use the environment variable

    ssl: {
        rejectUnauthorized: false
    },

});
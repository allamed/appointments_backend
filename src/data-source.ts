import {DataSource} from "typeorm";
import {Vendor} from "./entities/Vendor";
import {Buyer} from "./entities/Buyer";
import {Appointment} from "./entities/Appointment";

export const AppDataSource = new DataSource({

    type: "postgres",
    synchronize: true,
    logging: true,
    entities: [Vendor, Buyer, Appointment],

    url: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    },

});
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Vendor } from "./Vendor";
import { Buyer } from "./Buyer";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    type: string;

    @Column({ nullable: true })
    location?: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "hostId" })
    host: Vendor;

    @ManyToOne(() => Buyer)
    @JoinColumn({ name: "clientId" })
    client: Buyer;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;
}

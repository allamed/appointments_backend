import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vendor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}

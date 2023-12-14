import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Buyer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    companyName: string;
}

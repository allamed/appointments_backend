import { Router } from 'express';
import { Appointment } from '../entities/Appointment';
import { AppDataSource } from '../data-source';
import {Vendor} from "../entities/Vendor";
import {Buyer} from "../entities/Buyer";


const router = Router();

// Create a new appointment
router.post('/', async (req, res) => {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const vendorRepository = AppDataSource.getRepository(Vendor);
    const buyerRepository = AppDataSource.getRepository(Buyer);

    const { startTime, endTime, hostId, clientId } = req.body;
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    // Check if host (Vendor) exists
    const hostExists = await vendorRepository.findOneBy({ id: hostId });
    if (!hostExists) {
        return res.status(404).send('Host (Vendor) not found');
    }

    // Check if client (Buyer) exists
    const clientExists = await buyerRepository.findOneBy({ id: clientId });
    if (!clientExists) {
        return res.status(404).send('Client (Buyer) not found');
    }

    // Check for conflicting appointments
    console.log(`Checking for conflicts with hostId: ${hostId}, clientId: ${clientId}, startTime: ${startTime}, endTime: ${endTime}`);

    await AppDataSource.transaction(async transactionalEntityManager => {
        const conflict = await transactionalEntityManager
            .createQueryBuilder(Appointment, "appointment")
            .where("(appointment.hostId = :hostId OR appointment.clientId = :clientId)", { hostId, clientId })
            .andWhere("(appointment.startTime < :parsedEndTime AND appointment.endTime > :parsedStartTime)", { parsedEndTime, parsedStartTime })
            .getOne();

    if (conflict) {
        console.log(`Conflict found: ${JSON.stringify(conflict)}`);
        return res.status(400).send('Time conflict with an existing appointment');
    } else {
        console.log('No conflict found.');
        const newAppointment = appointmentRepository.create({
            ...req.body,
            host: hostExists,
            client: clientExists
        });
        await appointmentRepository.save(newAppointment);
        res.status(201).send(newAppointment);
    }
    // Create and save the new appointment

    });

});


router.get('/', async (req, res) => {
    const appointments = await AppDataSource.getRepository(Appointment).find({
        relations: ["host", "client"]
    });
    res.json(appointments);
});
router.delete('/:id', async (req, res) => {
    const result = await AppDataSource.getRepository(Appointment).delete(req.params.id);
    if (result.affected && result.affected > 0) {
        res.status(200).send('Appointment deleted successfully');
    } else {
        res.status(404).send('Appointment not found');
    }
});

// Edit an existing appointment
router.put('/:id', async (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const { startTime, endTime, hostId, clientId, title, type, location } = req.body;

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    // Check if the appointment exists
    const appointmentToUpdate = await AppDataSource.getRepository(Appointment).findOneBy({ id: appointmentId });
    if (!appointmentToUpdate) {
        return res.status(404).send('Appointment not found');
    }

    // Check if host (Vendor) exists
    const hostExists = await AppDataSource.getRepository(Vendor).findOneBy({ id: hostId });
    if (!hostExists) {
        return res.status(404).send('Host (Vendor) not found');
    }

    // Check if client (Buyer) exists
    const clientExists = await AppDataSource.getRepository(Buyer).findOneBy({ id: clientId });
    if (!clientExists) {
        return res.status(404).send('Client (Buyer) not found');
    }

    // Check for conflicting appointments excluding the current appointment
    const conflict = await AppDataSource.getRepository(Appointment)
        .createQueryBuilder("appointment")
        .where("(appointment.hostId = :hostId OR appointment.clientId = :clientId)", { hostId, clientId })
        .andWhere("appointment.id != :appointmentId", { appointmentId })
        .andWhere("(appointment.startTime < :parsedEndTime AND appointment.endTime > :parsedStartTime)", { parsedEndTime, parsedStartTime })
        .getOne();

    if (conflict) {
        return res.status(400).send('Time conflict with an existing appointment');
    }


    await AppDataSource.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.update(Appointment, appointmentId, {
            title,
            type,
            location,
            host: hostExists,
            client: clientExists,
            startTime: parsedStartTime,
            endTime: parsedEndTime
        });
    });

    res.status(200).send('Appointment updated successfully');
});



export default router;

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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Appointment_1 = require("../entities/Appointment");
const data_source_1 = require("../data-source");
const Vendor_1 = require("../entities/Vendor");
const Buyer_1 = require("../entities/Buyer");
const router = (0, express_1.Router)();
// Create a new appointment
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
    const vendorRepository = data_source_1.AppDataSource.getRepository(Vendor_1.Vendor);
    const buyerRepository = data_source_1.AppDataSource.getRepository(Buyer_1.Buyer);
    const { startTime, endTime, hostId, clientId } = req.body;
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    // Check if host (Vendor) exists
    const hostExists = yield vendorRepository.findOneBy({ id: hostId });
    if (!hostExists) {
        return res.status(404).send('Host (Vendor) not found');
    }
    // Check if client (Buyer) exists
    const clientExists = yield buyerRepository.findOneBy({ id: clientId });
    if (!clientExists) {
        return res.status(404).send('Client (Buyer) not found');
    }
    // Check for conflicting appointments
    console.log(`Checking for conflicts with hostId: ${hostId}, clientId: ${clientId}, startTime: ${startTime}, endTime: ${endTime}`);
    yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        const conflict = yield transactionalEntityManager
            .createQueryBuilder(Appointment_1.Appointment, "appointment")
            .where("(appointment.hostId = :hostId OR appointment.clientId = :clientId)", { hostId, clientId })
            .andWhere("(appointment.startTime < :parsedEndTime AND appointment.endTime > :parsedStartTime)", { parsedEndTime, parsedStartTime })
            .getOne();
        if (conflict) {
            console.log(`Conflict found: ${JSON.stringify(conflict)}`);
            return res.status(400).send('Time conflict with an existing appointment');
        }
        else {
            console.log('No conflict found.');
            const newAppointment = appointmentRepository.create(Object.assign(Object.assign({}, req.body), { host: hostExists, client: clientExists }));
            yield appointmentRepository.save(newAppointment);
            res.status(201).send(newAppointment);
        }
        // Create and save the new appointment
    }));
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield data_source_1.AppDataSource.getRepository(Appointment_1.Appointment).find({
        relations: ["host", "client"]
    });
    res.json(appointments);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_source_1.AppDataSource.getRepository(Appointment_1.Appointment).delete(req.params.id);
    if (result.affected && result.affected > 0) {
        res.status(200).send('Appointment deleted successfully');
    }
    else {
        res.status(404).send('Appointment not found');
    }
}));
// Edit an existing appointment
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentId = parseInt(req.params.id);
    const { startTime, endTime, hostId, clientId, title, type, location } = req.body;
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    // Check if the appointment exists
    const appointmentToUpdate = yield data_source_1.AppDataSource.getRepository(Appointment_1.Appointment).findOneBy({ id: appointmentId });
    if (!appointmentToUpdate) {
        return res.status(404).send('Appointment not found');
    }
    // Check if host (Vendor) exists
    const hostExists = yield data_source_1.AppDataSource.getRepository(Vendor_1.Vendor).findOneBy({ id: hostId });
    if (!hostExists) {
        return res.status(404).send('Host (Vendor) not found');
    }
    // Check if client (Buyer) exists
    const clientExists = yield data_source_1.AppDataSource.getRepository(Buyer_1.Buyer).findOneBy({ id: clientId });
    if (!clientExists) {
        return res.status(404).send('Client (Buyer) not found');
    }
    // Check for conflicting appointments excluding the current appointment
    const conflict = yield data_source_1.AppDataSource.getRepository(Appointment_1.Appointment)
        .createQueryBuilder("appointment")
        .where("(appointment.hostId = :hostId OR appointment.clientId = :clientId)", { hostId, clientId })
        .andWhere("appointment.id != :appointmentId", { appointmentId })
        .andWhere("(appointment.startTime < :parsedEndTime AND appointment.endTime > :parsedStartTime)", { parsedEndTime, parsedStartTime })
        .getOne();
    if (conflict) {
        return res.status(400).send('Time conflict with an existing appointment');
    }
    yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionalEntityManager.update(Appointment_1.Appointment, appointmentId, {
            title,
            type,
            location,
            host: hostExists,
            client: clientExists,
            startTime: parsedStartTime,
            endTime: parsedEndTime
        });
    }));
    res.status(200).send('Appointment updated successfully');
}));
exports.default = router;

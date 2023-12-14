import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { Repository } from 'typeorm';
import appointmentsRoutes from './routes/AppointmentsRoutes';
import { AppDataSource } from './data-source';
import { Appointment } from './entities/Appointment';

jest.mock('./data-source');


const mockAppointmentRepository: Partial<Repository<Appointment>> = {
    delete: jest.fn().mockResolvedValue({ affected: 1 }),

};

describe('Appointments Routes', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(bodyParser.json());
        app.use('/appointments', appointmentsRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();

        AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
            if (entity === Appointment) return mockAppointmentRepository as Repository<Appointment>;
            throw new Error(`Unknown entity: ${entity}`);
        });
    });

    it('should delete an appointment', async () => {
        const appointmentId = 1;

        const response = await request(app)
            .delete(`/appointments/${appointmentId}`)
            .expect(200);

        expect(response.text).toEqual('Appointment deleted successfully');
        expect(mockAppointmentRepository.delete).toHaveBeenCalledWith(appointmentId.toString()); // Expect a string
    });
});

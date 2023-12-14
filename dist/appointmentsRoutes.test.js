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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const AppointmentsRoutes_1 = __importDefault(require("./routes/AppointmentsRoutes"));
const data_source_1 = require("./data-source");
const Appointment_1 = require("./entities/Appointment");
jest.mock('./data-source');
// Define mock repositories
const mockAppointmentRepository = {
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    // Add other necessary mock methods
};
describe('Appointments Routes', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use('/appointments', AppointmentsRoutes_1.default);
    });
    beforeEach(() => {
        jest.clearAllMocks();
        data_source_1.AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
            if (entity === Appointment_1.Appointment)
                return mockAppointmentRepository;
            throw new Error(`Unknown entity: ${entity}`);
        });
    });
    it('should delete an appointment', () => __awaiter(void 0, void 0, void 0, function* () {
        const appointmentId = 1;
        const response = yield (0, supertest_1.default)(app)
            .delete(`/appointments/${appointmentId}`)
            .expect(200);
        expect(response.text).toEqual('Appointment deleted successfully');
        expect(mockAppointmentRepository.delete).toHaveBeenCalledWith(appointmentId.toString()); // Expect a string
    }));
});

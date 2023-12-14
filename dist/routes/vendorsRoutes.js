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
const Vendor_1 = require("../entities/Vendor");
const data_source_1 = require("../data-source");
const router = (0, express_1.Router)();
// Create a new vendor
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorRepository = data_source_1.AppDataSource.getRepository(Vendor_1.Vendor);
    const vendor = vendorRepository.create(req.body);
    yield vendorRepository.save(vendor);
    res.status(201).send(vendor);
}));
// Get all vendors
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield data_source_1.AppDataSource.getRepository(Vendor_1.Vendor).find();
    res.json(vendors);
}));
// Get a single vendor by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield data_source_1.AppDataSource.getRepository(Vendor_1.Vendor).findOneBy({ id: parseInt(req.params.id) });
    if (vendor) {
        res.json(vendor);
    }
    else {
        res.status(404).send('Vendor not found');
    }
}));
// Update a vendor
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorRepository = data_source_1.AppDataSource.getRepository(Vendor_1.Vendor);
    let vendor = yield vendorRepository.findOneBy({ id: parseInt(req.params.id) });
    if (vendor) {
        vendorRepository.merge(vendor, req.body);
        const results = yield vendorRepository.save(vendor);
        res.send(results);
    }
    else {
        res.status(404).send('Vendor not found');
    }
}));
// Delete a vendor
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield data_source_1.AppDataSource.getRepository(Vendor_1.Vendor).delete(req.params.id);
    res.send(results);
}));
exports.default = router;

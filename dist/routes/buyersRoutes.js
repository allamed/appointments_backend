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
const Buyer_1 = require("../entities/Buyer");
const data_source_1 = require("../data-source");
const router = (0, express_1.Router)();
// Create a new buyer
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const buyerRepository = data_source_1.AppDataSource.getRepository(Buyer_1.Buyer);
    const buyer = buyerRepository.create(req.body);
    yield buyerRepository.save(buyer);
    res.status(201).send(buyer);
}));
// Get all buyers
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buyers = yield data_source_1.AppDataSource.getRepository(Buyer_1.Buyer).find();
    res.json(buyers);
}));
// Get a single buyer by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield data_source_1.AppDataSource.getRepository(Buyer_1.Buyer).findOneBy({ id: parseInt(req.params.id) });
    if (buyer) {
        res.json(buyer);
    }
    else {
        res.status(404).send('Buyer not found');
    }
}));
// Update a buyer
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buyerRepository = data_source_1.AppDataSource.getRepository(Buyer_1.Buyer);
    let buyer = yield buyerRepository.findOneBy({ id: parseInt(req.params.id) });
    if (buyer) {
        buyerRepository.merge(buyer, req.body);
        const results = yield buyerRepository.save(buyer);
        res.send(results);
    }
    else {
        res.status(404).send('Buyer not found');
    }
}));
// Delete a buyer
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield data_source_1.AppDataSource.getRepository(Buyer_1.Buyer).delete(req.params.id);
    res.send(results);
}));
exports.default = router;

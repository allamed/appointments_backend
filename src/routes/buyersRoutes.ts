import { Router } from 'express';
import { Buyer } from '../entities/Buyer';
import { AppDataSource } from "../data-source"

const router = Router();

// Create a new buyer
router.post('/', async (req, res) => {
    console.log(req.body)
    const buyerRepository = AppDataSource.getRepository(Buyer);
    const buyer = buyerRepository.create(req.body);
    await buyerRepository.save(buyer);
    res.status(201).send(buyer);
});

// Get all buyers
router.get('/', async (req, res) => {
    const buyers = await AppDataSource.getRepository(Buyer).find();
    res.json(buyers);
});

// Get a single buyer by ID
router.get('/:id', async (req, res) => {
    const buyer = await AppDataSource.getRepository(Buyer).findOneBy({ id: parseInt(req.params.id) });
    if (buyer) {
        res.json(buyer);
    } else {
        res.status(404).send('Buyer not found');
    }
});

// Update a buyer
router.put('/:id', async (req, res) => {
    const buyerRepository = AppDataSource.getRepository(Buyer);
    let buyer = await buyerRepository.findOneBy({ id: parseInt(req.params.id) });
    if (buyer) {
        buyerRepository.merge(buyer, req.body);
        const results = await buyerRepository.save(buyer);
        res.send(results);
    } else {
        res.status(404).send('Buyer not found');
    }
});

// Delete a buyer
router.delete('/:id', async (req, res) => {
    const results = await AppDataSource.getRepository(Buyer).delete(req.params.id);
    res.send(results);
});

export default router;

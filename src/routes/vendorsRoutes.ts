import { Router } from 'express';
import { Vendor } from '../entities/Vendor';
import { AppDataSource } from '../data-source';

const router = Router();

// Create a new vendor
router.post('/', async (req, res) => {
    const vendorRepository = AppDataSource.getRepository(Vendor);
    const vendor = vendorRepository.create(req.body);
    await vendorRepository.save(vendor);
    res.status(201).send(vendor);
});

// Get all vendors
router.get('/', async (req, res) => {
    const vendors = await AppDataSource.getRepository(Vendor).find();
    res.json(vendors);
});

// Get a single vendor by ID
router.get('/:id', async (req, res) => {
    const vendor = await AppDataSource.getRepository(Vendor).findOneBy({ id: parseInt(req.params.id) });
    if (vendor) {
        res.json(vendor);
    } else {
        res.status(404).send('Vendor not found');
    }
});

// Update a vendor
router.put('/:id', async (req, res) => {
    const vendorRepository = AppDataSource.getRepository(Vendor);
    let vendor = await vendorRepository.findOneBy({ id: parseInt(req.params.id) });
    if (vendor) {
        vendorRepository.merge(vendor, req.body);
        const results = await vendorRepository.save(vendor);
        res.send(results);
    } else {
        res.status(404).send('Vendor not found');
    }
});

// Delete a vendor
router.delete('/:id', async (req, res) => {
    const results = await AppDataSource.getRepository(Vendor).delete(req.params.id);
    res.send(results);
});

export default router;

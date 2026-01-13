import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchDeals } from './services/dealsService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LunchDeals API is running' });
});

// Fetch deals endpoint
app.post('/api/deals', async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({
                error: 'Missing required parameters: lat and lng'
            });
        }

        console.log(`📍 Received request for deals at: ${lat}, ${lng}`);

        const deals = await fetchDeals({ lat, lng });

        res.json({
            success: true,
            count: deals.length,
            deals
        });
    } catch (error) {
        console.error('❌ Error in /api/deals:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch deals',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 LunchDeals API server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🍔 Deals endpoint: POST http://localhost:${PORT}/api/deals`);
});

#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const express = require('express');
const dns = require('dns').promises;
const { whoisDomain, hostToIP } = require('./lib/tools');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/whois', async (req, res) => {
    const { domain } = req.body;
    
    if (!domain) {
        return res.status(400).json({
            success: false,
            message: 'Domain is required!'
        });
    }
    
    try {
        const result = await whoisDomain(domain);
        res.json(result);
    } catch (error) {    
    
        res.status(500).json({
            success: false,
            message: `${error.message}`
        });
    }
});

app.post('/api/hosttoip', async (req, res) => {
    const { hostname } = req.body;
    
    if (!hostname) {
        return res.status(400).json({        
            success: false,
            message: 'Hostname is required!'
        });
    }
    
    try {
        const result = await hostToIP(hostname);
        res.json(result);
    } catch (error) {  
    
        res.status(500).json({
            success: false,
            message: `${error.message}`
        });
    }
});

app.listen(port, () => {
    console.log(chalk.green(`Server running on http://localhost:${port}`));
});
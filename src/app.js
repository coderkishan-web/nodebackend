const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const mockupRoutes = require('./routes/mockupRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const activityRoutes = require('./routes/activityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const socialMediaPlanRoutes = require('./routes/socialMediaPlanRoutes');
const socialMediaSubscriptionRoutes = require('./routes/socialMediaSubscriptionRoutes');
const socialMediaContentRoutes = require('./routes/socialMediaContentRoutes');
const socialMediaDashboardRoutes = require('./routes/socialMediaDashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const documentRoutes = require('./routes/documentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/mockups', mockupRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sm-plans', socialMediaPlanRoutes);
app.use('/api/sm-subscriptions', socialMediaSubscriptionRoutes);
app.use('/api/sm-content', socialMediaContentRoutes);
app.use('/api/sm-dashboard', socialMediaDashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'FlowStudio API is running (Node.js)' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

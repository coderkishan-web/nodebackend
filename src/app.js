const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const mockupRoutes = require("./routes/mockupRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const socialMediaPlanRoutes = require("./routes/socialMediaPlanRoutes");
const socialMediaSubscriptionRoutes = require("./routes/socialMediaSubscriptionRoutes");
const socialMediaContentRoutes = require("./routes/socialMediaContentRoutes");
const socialMediaDashboardRoutes = require("./routes/socialMediaDashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const documentRoutes = require("./routes/documentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

/* ================================
   RENDER / PROXY FIX
================================ */
app.set("trust proxy", 1);

/* ================================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: [
      "https://admin.weblyst.in", // Frontend (CMS UI)
      "https://api.weblyst.in",   // API (self-requests / tools / health checks)
      "http://localhost:5173",   // Vite dev
      "http://localhost:3000"    // React dev (if used)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);


app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   STATIC FILES
================================ */
// IMPORTANT: Render does NOT persist local storage
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/mockups", mockupRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sm-plans", socialMediaPlanRoutes);
app.use("/api/sm-subscriptions", socialMediaSubscriptionRoutes);
app.use("/api/sm-content", socialMediaContentRoutes);
app.use("/api/sm-dashboard", socialMediaDashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FlowStudio API is running 🚀"
  });
});

/* ================================
   404 HANDLER (IMPORTANT)
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* ================================
   ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
});

/* ================================
   SERVER
================================ */
const PORT = process.env.PORT || 10000; // Render prefers 10000+

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src';
import {connectDatabase} from './src/config/db';

dotenv.config();

const PORT = process.env.PORT || 8080;

// Connect DB first
connectDatabase();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('Database connection closed successfully.');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    } finally {
      process.exit(0);
    }
  });
};

// Ensure these are registered **only once**
['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.once(signal, () => shutdown(signal));
});

process.once('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason.stack || reason);
});

process.once('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error.stack || error);
  shutdown('uncaughtException');
});

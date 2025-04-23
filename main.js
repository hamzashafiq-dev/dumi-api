const { app, BrowserWindow } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

let db;

// Function to initialize SQLite database
function initializeDatabase() {
  db = new sqlite3.Database(path.join(__dirname, 'products.db'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
      db.run(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          description TEXT,
          stock INTEGER,
          thumbnail TEXT,
          discountPercentage REAL,
          quantity INTEGER DEFAULT 0
        )`,
        (err) => {
          if (err) {
            console.error('Error creating table:', err.message);
          } else {
            console.log('Products table initialized.');
            fetchAndStoreProducts();
          }
        }
      );
    }
  });
}

// Function to fetch products from API and store them in SQLite
async function fetchAndStoreProducts() {
  try {
    const response = await axios.get('https://dummyjson.com/products'); // Replace with your API URL
    const products = response.data.products;

    const insertQuery = `INSERT OR REPLACE INTO products 
      (id, name, price, description, stock, thumbnail, discountPercentage, quantity) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.serialize(() => {
      const stmt = db.prepare(insertQuery);
      products.forEach((product) => {
        stmt.run(
          product.id,
          product.title,
          product.price,
          product.description,
          product.stock,
          product.thumbnail,
          product.discountPercentage,
          0 // Default quantity
        );
      });
      stmt.finalize();
    });

    console.log('Products fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}

// Function to create the main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('./pos_web-brain/index.html');
}

app.whenReady().then(() => {
  initializeDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close((err) => {
      if (err) console.error('Error closing database:', err.message);
      else console.log('Database connection closed.');
    });
    app.quit();
  }
});

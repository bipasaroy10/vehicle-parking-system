import "dotenv/config";
import connectDB from './db/index.db.js';
import app from './app.js';


connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})

.catch((error) => {
    console.error("Failed to connect to the database", error);
}); 
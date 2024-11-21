const app = require('./app');
const { mongoConnection } = require('./models/mongoconnection');
require('dotenv').config();

const port = process.env.PORT || 4001;


        app.listen(port, async() => {
            await mongoConnection()
            console.log(`Server running at http://localhost:${port}`);
        });


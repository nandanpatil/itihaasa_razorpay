const express = require('express');
const cors=require('cors');
const app = express();
const port = 4000;
const router=require('./routes/payments.routes');
app.use(express.json());
app.use(cors())
app.use('/api',router);
app.get('/', (req, res) => {
res.send('Hello World!');
}
);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

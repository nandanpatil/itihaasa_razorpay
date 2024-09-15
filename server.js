const express = require('express');
const cors=require('cors');
const app = express();
const port = 4000;
const router=require('./routes/payments.routes');
const mongoose  = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use('/api',router);
app.get('/', (req, res) => {
res.send('Hello World!');
}
);

const dbConnect = async()=>{
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Db connected");
    } catch (error) {
        console.log(error)
    }
}

app.listen(port, () => {
    dbConnect();
    console.log(`Example app listening at http://localhost:${port}`);
});

const express       = require('express')
const mongoose      = require('mongoose')
const morgan        = require('morgan')
const bodyParser    = require('body-parser')
const cors          = require('cors')
const {readdirSync} = require('fs')
require('dotenv').config();


const authRoutes = require("./routes/auth")

const app = express()

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
})
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log(`DB CONNECTION ERR: ${err}`));

app.use(morgan("dev"));
app.use(bodyParser.json({limit: "2mb"}));
app.use(cors());



readdirSync('./routes').map((r) => app.use("/api", require("./routes/" +  r)));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is listening to the Port: ${port}`))
import { ENV } from "./src/config/env.js";

import app from "./src/app.js"

const PORT=ENV.PORT||5000;


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
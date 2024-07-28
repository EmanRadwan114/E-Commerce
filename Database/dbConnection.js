import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log(`database connected successfully`);
  })
  .catch((err) => {
    console.log(`there is an eror in database connection ${err}`);
  });

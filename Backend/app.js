const express = require("express");
require("dotenv").config();

const app = express();

app.listen(8000, () => {
  console.log(
    `Backend is listening on ${process.env.HOSTNAME}${process.env.PORT}`
  );
});

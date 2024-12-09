import React from "react";
import Header from "../header/Header";
import { Container, Typography } from "@mui/material";

function Error() {
  return (
    <Container >
      <Header />
      <Container sx={{ paddingTop: { xs: '50px', sm: '75px' }, }}>
        <Typography variant="h1">
          The page you are looking for doesn't exist. Please try again.
        </Typography>
      </Container>
      {/* <h1>The page you are looking for doesn't exist. Please try again.</h1> */}
    </Container>
  );
}

export default Error;

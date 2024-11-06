import React from "react";
import Header from "../header/Header";
import { Container, Typography } from "@mui/material";

function Error() {
    return (
        <Container>
            <Header /> 
            <Typography variant="h1">The page you are looking for doesn't exist. Please try again.</Typography>
            {/* <h1>The page you are looking for doesn't exist. Please try again.</h1> */}
        </Container>
    )
}

export default Error;
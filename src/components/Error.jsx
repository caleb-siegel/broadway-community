import React from "react";
import Navbar from "../Navbar";
import { Container, Typography } from "@mui/material";

function Error() {
    return (
        <Container>
            <Navbar /> 
            <Typography variant="h1">The page you are looking for doesn't exist. Please try again.</Typography>
            {/* <h1>The page you are looking for doesn't exist. Please try again.</h1> */}
        </Container>
    )
}

export default Error;
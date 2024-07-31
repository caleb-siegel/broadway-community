import React from "react";
import { Container, Card, CardHeader, CardMedia, Chip, Divider, Button } from '@mui/material'


function ShowCard({ show }) {
    return (
        <Container disableGutters sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 400, margin: '10px', padding: '10px', bgcolor: 'primary.main' }}>
                <CardHeader title={show.name}/>
                <CardHeader title={`$${show.price}`}/>
                <CardMedia component="img" height="194" image={show.image} alt={show.name}/>
                <Chip size="small" label={show.seatLocation} color="secondary" sx={{ margin: '1px'}}/>
                <Chip size="small" label={`${show.seatCount} Seats`} color="success" sx={{ margin: '1px'}}/>
                <Chip size="small" label={show.row} color="info" sx={{ margin: '1px'}}/>
                {/* <Divider /> */}
                <br/>
                <Button size="small" variant="contained" color="background" sx={{ margin: "10px" }}>Buy Now</Button>
            </Card>
        </Container>
    )
}

export default ShowCard;
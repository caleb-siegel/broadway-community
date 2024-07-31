import React from "react";
import { Container, Card, CardHeader, CardMedia, Chip, Divider, Button } from '@mui/material'

function ShowCard({ show }) {
    return (
        <Container disableGutters sx={{ display: 'flex', justifyContent: 'center', padding: 0  }}>
            <Card sx={{ width: '90%', margin: '10px', padding: '10px', bgcolor: 'primary.main' }}>
                <CardHeader title={<strong>{show.name}</strong>} sx={{ color: 'secondary.main', padding: 0 }}/>
                <CardHeader title={`$${show.price}`} sx={{ color: '#ffffff' }}/>
                <Chip size="small" label={`${show.seatCount} Seats`} color="success" sx={{ margin: '1px'}}/>
                <Chip size="small" label={show.seatLocation} color="secondary" sx={{ margin: '1px'}}/>
                <Chip size="small" label={show.row} color="info" sx={{ margin: '1px'}}/>
                <CardMedia component="img" height="194" image={show.image} alt={show.name}/>
                <Button size="small" variant="contained" color="background" sx={{ margin: "10px", color: 'secondary.main' }}>Buy Now</Button>
            </Card>
        </Container>
    )
}

export default ShowCard;
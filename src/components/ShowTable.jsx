import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ShowTable({ shows }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Show</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right"># of Seats</TableCell>
                    <TableCell align="right">Location</TableCell>
                    <TableCell align="right">Row</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {shows.map((show) => (
                    <TableRow
                    key={show.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {show.name}
                    </TableCell>
                    <TableCell align="right">${show.price}</TableCell>
                    <TableCell align="right">{show.seatCount}</TableCell>
                    <TableCell align="right">{show.seatLocation}</TableCell>
                    <TableCell align="right">{show.row}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>  
    )
}

export default ShowTable
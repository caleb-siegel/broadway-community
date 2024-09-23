import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Link } from '@mui/material';
import "./table.css";


function Table({ shows }) {
    const columns = [
        { field: 'name', headerName: 'Show', width: 180 },
        { 
            field: 'min_ticket_price', 
            headerName: 'Price', 
            width: 80, 
            type: 'number',
            renderCell: (params) => {
              if (params.value != null) {
                return `$${params.value}`;  // Ensures two decimal places for the price
              }
              return '';
            }
        },
        { field: 'venue_name', headerName: 'Theater', width: 130, type:'number' },
        { field: 'start_date', headerName: 'Date', width: 150, },
        {
            field: 'href',
            headerName: 'Link',
            width: 150,
            renderCell: (params) => (
                <Link href={params.value} target="_blank" rel="noopener noreferrer">
                    View Tickets
                </Link>
            ),
        },
        // 
        // {
        //   field: 'name',
        //   headerName: 'Full name',
        //   description: 'This column has a value getter and is not sortable.',
        //   sortable: false,
        //   width: 160,
        //   valueGetter: (value, show) => `${show.name || ''} ${show.price || ''}`,
        // },
        
    ];
    
    return (
        <Paper >
            <DataGrid
                rows={shows}
                columns={columns}
                // initialState={{
                //     pagination: {
                //         paginationModel: { page: 0, pageSize: 5 },
                //     },
                // }}
                // pageSizeOptions={[5, 10]}
                // checkboxSelection
            />
        </Paper>
    )
}

export default Table
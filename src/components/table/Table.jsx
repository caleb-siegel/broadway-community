import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Link } from '@mui/material';
import "./table.css";


function Table({ shows }) {
    const columns = [
        { field: 'name', headerName: 'Show', width: 180 },
        // {
        //     field: 'name',
        //     headerName: 'Show',
        //     width: 180,
        //     valueGetter: (params) => {
        //         // Safely access the nested event_info[0].name
        //         return params.row.event_info && params.row.event_info[0] ? params.row.event_info[0].name : 'N/A';
        //     }
        // },
        { 
            field: 'price', 
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
        {
            field: 'href',
            headerName: 'Link',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Link href={params.value} target="_blank" rel="noopener noreferrer">
                    View Tickets
                </Link>
            ),
        },
        { field: 'venue_name', headerName: 'Theater', width: 130, type:'number' },
        { 
            field: 'formatted_date', 
            headerName: 'Date', 
            width: 150, 
            // type: 'date',
            // valueGetter: (params) => new Date(params.row['start_date']),
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
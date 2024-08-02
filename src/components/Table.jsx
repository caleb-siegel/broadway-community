import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material'


function Table({ shows }) {
    const columns = [
        { field: 'name', headerName: 'Show', width: 200 },
        { field: 'price', headerName: 'Price', width: 200 },
        
        { field: 'seatCount', headerName: '# of Seats', width: 130 },
        { field: 'seatLocation', headerName: 'Location', width: 150 },
        { field: 'row', headerName: 'Row', width: 130 },
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
        <Paper style={{ height: 400, width: '100%', marginTop: '20px' }}>
            <DataGrid
                rows={shows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
            />
        </Paper>
    )
}

export default Table
import React from 'react';
import { Box, Stack, Skeleton } from '@mui/material';
import "./home.css";

const ShowSkeleton = () => {
    return (
        <Box className="home__skeleton" display="flex" flexDirection="column" flexWrap="wrap">
            <p>Your data is loading...</p>
            <br/>
            <Box>
                <Stack spacing={1} mr={4}>
                    <Skeleton variant="rounded" width={210} height={250} />
                </Stack>
            </Box>
            {/* <Box>
                <Stack spacing={1} mr={4}>
                    <Skeleton variant="rounded" width={210} height={250} />
                </Stack>
            </Box>
            <Box>
                <Stack spacing={1} mr={4}>
                    <Skeleton variant="rounded" width={210} height={250} />
                </Stack>
            </Box> */}
        </Box>
    )
}

export default ShowSkeleton
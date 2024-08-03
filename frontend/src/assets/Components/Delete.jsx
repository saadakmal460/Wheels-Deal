import React from 'react'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


const Delete = ({onClick}) => {
    return (
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onClick}>
            Delete
        </Button>
    )
}

export default Delete

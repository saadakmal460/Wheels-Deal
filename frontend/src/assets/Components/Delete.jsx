import React from 'react'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


const Delete = ({onClick , disabled}) => {
    return (
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onClick} disabled={disabled}>
            {disabled ? 'Deleting' : 'Delete'}
        </Button>
    )
}

export default Delete

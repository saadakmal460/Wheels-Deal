import React from 'react'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


const Delete = ({onClick}) => {
    return (
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onClick}>
            Delete
        </Button>
    )
}

export default Delete

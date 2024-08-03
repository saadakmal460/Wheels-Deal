import React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

const Edit = ({ onClick }) => {
    return (
        <Button variant="outlined" startIcon={<EditIcon />} onClick={onClick}>
            Edit
        </Button>
    );
};

export default Edit;

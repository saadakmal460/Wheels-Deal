exports.userController = (req,res) =>{
    try {
        return res.status(200).json('Working');
    } catch (error) {
        return res.status(500).json(error);
        
    }
    
}


import React from 'react'

const Footer = () => {
    return (
        <>
            <footer class="bg-white-900 text-black border py-4">
                <div class="container mx-auto flex items-center justify-between">
                    
                    <div class="flex items-center">
                        <img src="/Images/main6.png" alt="Logo" class="h-8 w-auto"/>
                    </div>

                    
                    <div class="text-sm">
                        &copy; {`${new Date().getFullYear()} Wheels Deal. All rights reserved.`}
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer

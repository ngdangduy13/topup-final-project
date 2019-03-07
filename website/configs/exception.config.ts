const config = {
    responseMessages: {
        BadRequest: { message: 'Invalid Input' },
        Internal: { message: 'Internal Server Error' },
        Unauthorized: { message: 'Token is invalid or expired' },
        Success: { message: 'Successful Operation' },
        NotFound: { message: 'Not Found' },
    },
};
export default config;

let backendUrl;

if(import.meta.env.MODE === 'development'){
    backendUrl = 'http://localhost:8000';
}else{
    backendUrl = import.meta.env.VITE_API_URL
}


export {backendUrl}
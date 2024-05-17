import { Typography } from "@mui/material";
import useLocalStorage from "../API/useLocalStorage.js";

const Dashboard = () => {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});

    return (  
        <>
        <h1>Dashboard</h1>
        <Typography>Welcome {adminCredentials.firstName}</Typography>

        <h2>Datasets</h2>
        
        


        <h2>questions</h2>
        
        </>
    );
}
 
export default Dashboard

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../API/useLocalStorage";

const Logout = () => {
    const navigate = useNavigate();
    const [adminCredentials,setAdminCredentials] = useLocalStorage('adminCredentials', {});
    useEffect(() => {
        const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;
        if(!isAuthenticated){
            navigate('/login');
            
        }
        // Redirect to login page
        setAdminCredentials({});
       
    }, [adminCredentials]);
    return ( 
        <>
        </>
     );
}
 
export default Logout;
import { Box } from "@mui/material";
import ChatModule from "../components/Chat/ChatModule";
import { ChatProvider } from "../components/Chat/ChatContext";
import HistoryDrawer from "../components/Chat/HistoryDrawer";

const AdminChatPage = () => {
    return ( 
        <ChatProvider isTemporary={true}>
             <Box sx={{
            display: 'flex',
            height: '100vh',
            flexDirection: 'row', 
        }}>
            <HistoryDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 1, overflow: 'auto' }}>
                <ChatModule />
            </Box>
        </Box>

        </ChatProvider>
       
    );
}

export default AdminChatPage;

import { Box } from "@mui/material";
import ChatModule from "../components/Chat/ChatModule";
import { ChatProvider } from "../components/Chat/ChatContext";
import HistoryDrawer from "../components/Chat/HistoryDrawer";
import Banner from "./Banner";
import Footer from "./Footer";


const ChatPage = () => {
    return ( 
        <>
        <Banner />
        <ChatProvider>
             <Box sx={{
            display: 'flex',
            height: '10%',
            flexDirection: 'row', 
        }}>
            <HistoryDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 1, overflow: 'auto' }}>
                <ChatModule />
            </Box>
        </Box>


        </ChatProvider>
        <Footer/>
        </>
       
    );
}

export default ChatPage;

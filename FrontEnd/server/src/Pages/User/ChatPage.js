import { Box } from "@mui/material";
import ChatModule from "../components/Chat/ChatModule";
import { ChatProvider } from "../components/Chat/ChatContext";
import HistoryDrawer from "../components/Chat/HistoryDrawer";
import Banner from "./Banner";
import Footer from "./Footer";
import { Canvas } from "@react-three/fiber";
import Pseudo3dImage from "../components/Image/Pseudo3dImage";

const ChatPage = () => {
    return ( 
        <>
        <Banner />
        <ChatProvider>
            {/* Position the Canvas as a fixed background covering the whole screen */}
            <Canvas style={{
                position: 'fixed', // Fixed position
                top: 0, // Align to the top of the viewport
                left: 0, // Align to the left of the viewport
                width: '100vw', // Full viewport width
                height: '100vh', // Full viewport height
                zIndex: -1, // Ensure it stays behind other content
                filter: 'blur(12px)'
            }}>
                <Pseudo3dImage imageUrl="/citLogo.jpg" depthMapUrl="/citLogo_depth.jpg" imgScale={0.5} />
            </Canvas>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%', // Adjust height to fill screen
            }}>
                <HistoryDrawer />
                <Box component="main" sx={{ flexGrow: 1, p: 1, overflow: 'auto' }}>
                    <ChatModule />
                </Box>
            </Box>
        </ChatProvider>
        <Footer />
        </>
    );
}

export default ChatPage;

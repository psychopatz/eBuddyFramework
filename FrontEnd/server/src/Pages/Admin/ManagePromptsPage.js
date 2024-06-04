import styled from "@emotion/styled";
import { PromptContext, PromptProvider } from "../../components/Prompt/PromptContext";
import PromptListView from "../../components/Prompt/PromptListView";
import { Box } from "@mui/material";
import PromptsForm from "../../components/Prompt/PromptsForm";
import Pseudo3dImage from "../../components/Image/Pseudo3dImage";
import { Canvas } from "@react-three/fiber";
import BtnCustom from "../../components/component/BtnCustom";




const FormHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
});

const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  height: '100vh',
  padding: 16,
});

const LeftPanel = styled(Box)({
  flex: 1,
  marginRight: 8,
  overflow: 'auto',
  maxHeight: '100%',
});

const RightPanel = styled(Box)({
  flex: 3,
  overflow: 'auto',
  maxHeight: '100%',
});
const ManagePromptsPage = () => {
    return ( 
        <>
        <PromptProvider>
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
      <PageContainer>
        <LeftPanel>
          <BtnCustom variant="contained" color="primary" onClick={() => window.location.reload()}>Create New Dataset</BtnCustom>
          <PromptListView/>
        </LeftPanel>
        <RightPanel>
          <PromptsForm/>
        </RightPanel>
      </PageContainer>
    </PromptProvider>
        </>
     );
}
 
export default ManagePromptsPage;
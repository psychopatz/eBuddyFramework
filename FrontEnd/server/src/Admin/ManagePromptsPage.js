import styled from "@emotion/styled";
import { PromptContext, PromptProvider } from "../components/Prompt/PromptContext";
import PromptListView from "../components/Prompt/PromptListView";
import { Box } from "@mui/material";
import BtnCustom from "../components/BtnCustom";
import PromptsForm from "../components/Prompt/PromptsForm";



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
  backgroundColor: 'red',
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
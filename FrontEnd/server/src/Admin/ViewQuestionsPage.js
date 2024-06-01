import React from 'react';
import { Box, styled } from '@mui/material';
import { QuestionProvider } from '../components/Question/QuestionContext';
import QuestionsListView from '../components/Question/QuestionsListView';
import QuestionsForm from '../components/Question/QuestionsForm';
import { Canvas } from '@react-three/fiber';
import Pseudo3dImage from '../components/Image/Pseudo3dImage';


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

const ViewQuestionsPage = () => {
  return (
    <QuestionProvider> 
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
          <QuestionsListView />
        </LeftPanel>
        <RightPanel>
          <QuestionsForm/>
        </RightPanel>
      </PageContainer>
    </QuestionProvider>
  );
};

export default ViewQuestionsPage;

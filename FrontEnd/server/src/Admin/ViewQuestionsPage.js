import React from 'react';
import { Box, styled } from '@mui/material';
import { QuestionProvider } from '../components/Question/QuestionContext';
import QuestionsListView from '../components/Question/QuestionsListView';
import QuestionsForm from '../components/Question/QuestionsForm';


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

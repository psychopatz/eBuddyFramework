import React from 'react';
import { Box, styled } from '@mui/material';
import DatasetsForm from "../components/Dataset/DatasetsForm";
import DatasetsListView from "../components/Dataset/DatasetsListView";
import {DatasetProvider} from "../components/Dataset/DatasetContext";
import BtnCustom from '../components/BtnCustom';

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

const ManageDatasetsPage = () => {
  return (
    <DatasetProvider> 
      <PageContainer>
        <LeftPanel>
          <BtnCustom variant="contained" color="primary" onClick={() => window.location.reload()}>Create New Dataset</BtnCustom>
          <DatasetsListView />
        </LeftPanel>
        <RightPanel>
          <DatasetsForm />
        </RightPanel>
      </PageContainer>
    </DatasetProvider>
  );
};

export default ManageDatasetsPage;

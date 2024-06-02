import { Box, Typography } from "@mui/material";
import useLocalStorage from "../API/useLocalStorage.js";
import GetGreeting from "../Tools/GetGreeting.js";
import PieModule from "../components/Dashboard/PieModule.js";
import { useEffect, useState } from "react";
import { ApiDataset } from "../API/ApiDataset.js";
import { ApiIngest } from "../API/ApiIngest.js";
import { ApiQuestion } from "../API/ApiQuestion.js";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import Pseudo3dImage from "../components/Image/Pseudo3dImage.js";
import { useToast } from "../components/Notification/Toast.js";

const FullScreenWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1,
  backgroundColor: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
}));

const SystemStatusTypography = styled(Typography)(({ color }) => ({
  fontSize: '1.5rem',
  marginTop: '20px',
  color: color,
  fontWeight: 'bold'
}));

const DashboardPage = () => {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const firstName = adminCredentials.firstName.charAt(0).toUpperCase() + adminCredentials.firstName.slice(1);
    const lastName = adminCredentials.lastName.charAt(0).toUpperCase() + adminCredentials.lastName.slice(1);

    const [items, setItems] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [ingestsDocs, setIngestsDocs] = useState([]);
    const [logs, setLogs] = useState({ datasets: 0, questions: 0, errors: 0 });

    const showToast = useToast();
    const [messageInfo, setMessageInfo] = useState({ message: "Initializing, please wait...", color: "#f0f0f0" });

    useEffect(() => {
      ApiDataset.get()
        .then(response => {
          const mappedItems = response.data.map(item => ({
            id: item.id,
            name: item.name,
            question: item.Question,
            answer: item.Answer,
            context: item.Context,
            ingestId: item.IngestId
          }));
          setItems(mappedItems);
          setLogs(logs => ({ ...logs, datasets: mappedItems.length }));
          console.log('Datasets fetched:', response.data);
        })
        .catch(error => {
          console.error('Failed to fetch datasets:', error);
        });

      ApiIngest.list()
        .then(response => {
          setIngestsDocs(response.data.documents);
          console.log("Ingests fetched:", response.data);
        })
        .catch(err => {
          console.error("Failed to fetch ingests", err);
        });

      ApiQuestion.get()
        .then(response => {
          const filteredItems = response.data.filter(item => !item.isResolved);
          setQuestions(filteredItems);
          setLogs(logs => ({ ...logs, questions: filteredItems.length }));
          console.log('Questions fetched:', response.data);
        })
        .catch(error => {
          console.error('Failed to fetch questions:', error);
        });
    }, []);

    useEffect(() => {
      // Calculate errors every time items or ingestsDocs changes
      const errors = items.length - (ingestsDocs ? ingestsDocs.length : 0);
      setLogs(logs => ({ ...logs, errors }));
    }, [items, ingestsDocs]);  // Dependency array ensures this runs when items or ingestsDocs update


    useEffect(() => {
      // Calculate errors and other messages based on logs
      if (logs.datasets > 0 && logs.datasets === logs.errors) {
        setMessageInfo({ message: "Error: LLM Backend is down!", color: "red" });
      } else if (logs.errors > 0) {
        setMessageInfo({ message: `Warning: There are ${logs.errors} uningested datasets in the system. Please address them!`, color: "orange" });
      } else if (questions.length / items.length >= 0.5) {
        setMessageInfo({ message: `Warning: High volume of unresolved questions (${questions.length} questions, answer them now!)!`, color: "yellow" });
      } else if (questions.length === 0) {
        setMessageInfo({ message: "Congratulations! All questions have been resolved!", color: "green" });
      } else {
        setMessageInfo({ message: `System is running smoothly. You have ${questions.length} unresolved questions.`, color: "lightgreen" });
      }
    }, [logs, questions.length, items.length]);

    return (
        <FullScreenWrapper>
          <StyledBox>
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>
                {GetGreeting()}, {firstName} {lastName}
            </Typography>
            <PieModule answers={items.length} questions={questions.length} errors={logs.errors} />
             <SystemStatusTypography color={messageInfo.color} sx={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>
                {messageInfo.message}
            </SystemStatusTypography>
          </StyledBox>
          <Canvas style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(90%)',
                filter: 'blur(10px)',
            }}>
                <Pseudo3dImage imageUrl="/landingImage.jpg" depthMapUrl="/landingImage_depth.jpg" />
            </Canvas>
        </FullScreenWrapper>
    );
}

export default DashboardPage;

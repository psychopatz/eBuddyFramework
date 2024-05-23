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

const FullScreenWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1, // Ensure it's above other elements if necessary
  backgroundColor: 'primary.main', // Optional, based on your theme or preference
  display: 'flex', // Added to use flexbox for centering
  alignItems: 'center', // Aligns children vertically in the center
  justifyContent: 'center', // Aligns children horizontally in the center
});

const StyledBox = styled(Box)(({ theme }) => ({
  zIndex: 10, // Ensures the box is above the canvas
  position: 'absolute', // Keep position absolute to layer it on top of the Canvas
  top: '50%', // Set top to 50% of its parent
  left: 0, // Align left to 0 to start from the left edge
  transform: 'translateY(-50%)', // Adjust only vertically to center
  width: '100%', // Set width to 100% of its parent
  padding: theme.spacing(4), // Use theme spacing for consistent padding
  borderRadius: theme.shape.borderRadius, // Use theme border radius
  display: 'flex',
  flexDirection: 'column', // Stack children vertically
  alignItems: 'center', // Center children horizontally
  justifyContent: 'center', // Center children vertically
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
}));




const DashboardPage = () => {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const firstName = adminCredentials.firstName.charAt(0).toUpperCase() + adminCredentials.firstName.slice(1);
    const lastName = adminCredentials.lastName.charAt(0).toUpperCase() + adminCredentials.lastName.slice(1);

    const [items, setItems] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [ingestsDocs, setIngestsDocs] = useState([]);

    const [dataCount, setDataCount] = useState({
      datasets: 0,
      questions: 0,
      ingests: 0});

     useEffect(() => {

    //Get all datasets
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
        console.log('Datasets fetched:', response.data);
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      });

      //Get all ingests List
      ApiIngest.list()
      .then(response => {
        setIngestsDocs(response.data.documents);
        console.log("Ingests fetched:", response.data);
      })
      .catch(err => {
        console.error("Failed to fetch ingests", err);
      });

      //Get all questions
      ApiQuestion.get()
        .then(response => {
          const filteredItems = response.data.filter(item => !item.isResolved);
          setQuestions(filteredItems);
          console.log('Datasets fetched:', response.data);

        })
        .catch(error => {
          console.error('Failed to fetch datasets:', error);
        });


      
  }, []);

    return (  
        <FullScreenWrapper>
          <StyledBox>
            <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'white'}}>
                {GetGreeting()}, {firstName} {lastName}
            </Typography>
            <PieModule answers={items.length} questions={questions.length} errors={!ingestsDocs ? 9999 : items.length - ingestsDocs.length}/>


        
          </StyledBox>
          <Canvas style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(90%)',
                filter: 'blur(10px)',
            }}>
                <Pseudo3dImage imageUrl="/landingImage.png" depthMapUrl="/landingImage_depth.png" />
            </Canvas>

        </FullScreenWrapper>
    );
}
 
export default DashboardPage

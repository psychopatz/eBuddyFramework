import { Typography } from "@mui/material";
import useLocalStorage from "../API/useLocalStorage.js";
import GetGreeting from "../Tools/GetGreeting.js";
import PieModule from "../components/Dashboard/PieModule.js";
import { useEffect, useState } from "react";
import { ApiDataset } from "../API/ApiDataset.js";
import { ApiIngest } from "../API/ApiIngest.js";
import { ApiQuestion } from "../API/ApiQuestion.js";

const DashboardPage = () => {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const firstName = adminCredentials.firstName.charAt(0).toUpperCase() + adminCredentials.firstName.slice(1);
    const lastName = adminCredentials.lastName.charAt(0).toUpperCase() + adminCredentials.lastName.slice(1);

    const [items, setItems] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [ingestsDocs, setIngestsDocs] = useState([]);

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
        setIngestsDocs(response.data); // Assuming the response data is the array of ingests
        console.log("Ingests fetched:", response.data);
      })
      .catch(err => {
        console.error("Failed to fetch ingests", err);
      });

      //Get all questions
      ApiQuestion.get()
        .then(response => {
          const filteredItems = response.data.filter(item => !item.isResolved);
          const mappedItems = filteredItems.map(item => ({
            id: item.id,
            summary: item.summary,
            dateCreated: item.dateCreated,
            isResolved: item.isResolved,
            chatHistory: item.chatHistory
          }));
          setQuestions(filteredItems);
          console.log('Datasets fetched:', response.data);
        })
        .catch(error => {
          console.error('Failed to fetch datasets:', error);
        });


      
  }, []);

    return (  
        <>
        <h1>Dashboard</h1>
        <Typography>{GetGreeting()}, {firstName} {lastName}</Typography>

        <h2>Datasets Graph pila kabuok ang answeranan ug pila na ang naansweran nga piechart https://mui.com/x/react-charts/pie/</h2>
        <PieModule answers={items ? items.length : 100 } questions={questions ? questions.length : 100} errors={ingestsDocs ? ingestsDocs.length - items.length : 0}/>
        
        <h2>List of Prompts ranked by popularity para sa chat defaults nga common questions</h2>

        <h2>churva2 ngali</h2>
        
        </>
    );
}
 
export default DashboardPage

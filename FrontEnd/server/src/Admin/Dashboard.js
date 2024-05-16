import DatasetsListView from "../components/Dataset/DatasetsListView.js";

const Dashboard = () => {
 const itemList = [
  { id: 1, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 2, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 3, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 4, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 5, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 6, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 7, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 8, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 9, primary: 'Single-line item', secondary: 'Secondary text' },
  { id: 10, primary: 'Single-line item', secondary: 'Secondary text' },
];
    return (  
        <>
        <h1>Dashboard</h1>

        <h2>Datasets</h2>
        {/* <DatasetsListView items={itemList}  /> */}
        


        <h2>questions</h2>
        
        </>
    );
}
 
export default Dashboard

import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';

export default function PieModule({answers = 0, questions = 0, errors = 0, width = 600, height = 400}) {
    const navigate = useNavigate();
    const handlePieClick = (data) => {
    console.log("Clicked data: ", data);  // This will show what data is being passed to the handler

    switch (data.label) {
        case 'Answers':
            console.log('Navigating to /admin/');
            navigate('/admin/');
            break;
        case 'Questions':
            console.log('Navigating to /admin/manage-questions');
            navigate('/admin/manage-questions');
            break;
        case 'Errors':
            console.log('Navigating to /admin/manage-errors');
            navigate('/admin/manage-errors');
            break;
        default:
            console.error('Unexpected label:', data.label);
    }
};
  
    return (
    <>
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: answers, label: 'Answers', color: 'green' },
            { id: 1, value: questions, label: 'Questions', color: "yellow"},
            { id: 2, value: errors, label: 'Errors', color: 'red'},
          ],
            innerRadius: 20,
            outerRadius: 200,
            paddingAngle: 3,
            cornerRadius: 5,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 50, additionalRadius: -40, color: 'gray', paddingAngle: 10},
            },
            
            
            
      ]}
      width={width}
      height={height}
      
    />
    
    
    
    </>
      
    
    
  );
}
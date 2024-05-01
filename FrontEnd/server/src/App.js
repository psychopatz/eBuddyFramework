import { useHealthCheck, HealthCheck } from './API/useHealthCheck';
import './App.css';
import ChatModule from './ChatModule';


function App() {
  
  return (
    <div className="App">
      <ChatModule/>
      <HealthCheck/>
    </div>
  );
}

export default App;

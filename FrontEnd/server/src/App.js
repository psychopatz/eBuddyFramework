import { useHealthCheck, HealthCheck } from './API/useHealthCheck';
import DocumentManager from './Admin/DocumentManager';
import './App.css';
import ChatModule from './components/ChatModule';
import IngestDocuments from './components/IngestDocuments';



function App() {
  
  return (
    <div className="App">
      <ChatModule/>
      {/* <HealthCheck/> */}
      <IngestDocuments/>
      <DocumentManager/>
    </div>
  );
}

export default App;

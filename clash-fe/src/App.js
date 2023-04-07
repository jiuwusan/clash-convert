import './App.css';
import Sub from './pages/Sub/index';
import bg from './bg.jpg';

function App() {
  return (
    <>
      <img className='app-bg' src={bg} />
      <div className="app">
        <div className='app-content'>
          <Sub></Sub>
        </div>
      </div>
    </>
  );
}

export default App;

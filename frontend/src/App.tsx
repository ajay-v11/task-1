import {Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import PageComponent from './pages/MainPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PageComponent />}></Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<UserRegisterPage />} />
      </Routes>
    </>
  );
}

export default App;

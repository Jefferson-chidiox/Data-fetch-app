import React from 'react';
import SearchableDataList from './components/SearchableDataList';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Post List</h1>
            <SearchableDataList />
        </div>
    );
};

export default App;

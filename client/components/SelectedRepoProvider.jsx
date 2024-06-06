import React, {createContext, useContext, useState} from 'react';

const defaultContextValue = {
  selected: [],
  handleClick: (repoName) => { }
}

const SelectedRepoContext = createContext(defaultContextValue);

const useSelectedRepo = () => useContext(SelectedRepoContext);

const SelectedRepoProvider = ({children}) => {
  const [selected, setSelected] = useState([]);

  const handleClick = (repoName) => {
    setSelected(prevSelected => {
      return prevSelected.includes(repoName) ?
        prevSelected.filter(item => item !== repoName) :
        [...prevSelected, repoName];
    });
  };

  return (
    <SelectedRepoContext.Provider value={{ selected, handleClick}}>
      {children}
    </SelectedRepoContext.Provider>
  )
}

export { SelectedRepoProvider, useSelectedRepo };

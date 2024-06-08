import React, { createContext, useContext, useState } from 'react';

const defaultContextValue = {
  selected: [],
  handleClickSelect: (repoName) => { }
}

const SelectedRepoContext = createContext(defaultContextValue);

const useSelectedRepo = () => useContext(SelectedRepoContext);

const SelectedRepoProvider = ({ children }) => {
  const [selected, setSelected] = useState('');

  const handleClickSelect = (repoName) => {
    // setSelected(prevSelected => {
    //   return prevSelected.includes(repoName) ?
    //     prevSelected.filter(item => item !== repoName) :
    //     [...prevSelected, repoName];
    // });
    // making it so that clciking select on the repo that was already selected will deselect it.
    repoName === selected ? setSelected('') : setSelected(repoName);
    // kg 2024-06-07_10-12-PM: state often takes a few miliseconds(?) to update after being set, so console logging the parameter passed in will be more accurate here
    // console.log(selected, 'selected!');
    console.log('handleClickSelect:', repoName);
  };

  return (
    <SelectedRepoContext.Provider value={{ selected, handleClickSelect }}>
      {children}
    </SelectedRepoContext.Provider>
  )
}

export { SelectedRepoProvider, useSelectedRepo };

import React, {useState} from 'react';
import forks from '../assets/icons/forks.png'
import { useSelectedRepo } from './SelectedRepoProvider';

const RepoComponent = () => {
  const {selected, handleClick} = useSelectedRepo();

  const arrayTest = [
    {
      repoName: 'Yesql',
      mainLang: 'JavaScript',
      private: true,
      updated: 'Mar 28',
      forkedFrom: 'open-source-labs/Yesql',
      numberOfForks: '1'
    },
    {
      repoName: 'DataDuck',
      mainLang: 'Python',
      private: false,
      updated: 'Apr 14',
      forkedFrom: null,
      numberOfForks: '34'
    },
    {
      repoName: 'ReactEnhancer',
      mainLang: 'TypeScript',
      private: true,
      updated: 'May 22',
      forkedFrom: 'community/ReactEnhancer',
      numberOfForks: '18'
    },
    {
      repoName: 'JunoGraph',
      mainLang: 'Java',
      private: false,
      updated: 'Jan 11',
      forkedFrom: null,
      numberOfForks: '58'
    },
    {
      repoName: 'VirtuosoAPI',
      mainLang: 'Go',
      private: true,
      updated: 'Feb 29',
      forkedFrom: 'api-labs/VirtuosoAPI',
      numberOfForks: '5'
    },
    {
      repoName: 'QuantumStack',
      mainLang: 'C++',
      private: true,
      updated: 'Dec 03',
      forkedFrom: 'quantum/QuantumStack',
      numberOfForks: '12'
    }
  ]

  const checkLang = (repoArr) => {
    repoArr.forEach(repo => {
      switch (repo.mainLang) {
      case 'JavaScript' : 
        repo.mainLangColor = '#f1df5a'; break;
      case 'Python' : 
        repo.mainLangColor = '#3672a5'; break;
      case 'Go' : 
        repo.mainLangColor = '#00add8'; break;
      case 'TypeScript' : 
        repo.mainLangColor = '#3178c6'; break;
      case 'C#' :
        repo.mainLangColor = '#188600'; break;
      case 'Svelte':
        repo.mainLangColor = '#f75b2b'; break;
      case 'PHP':
        repo.mainLangColor = '#505e95'; break;
      case 'Java':
        repo.mainLangColor = '#b07219'; break;
      case 'Ruby' : 
        repo.mainLangColor = '#701516'; break;
      default: 
        repo.mainLangColor = '#d3d3d3'; break;
      }
    })
  }
  return (
    <>
    {arrayTest.map((repo, index) => (
      <div key={index} 
        className="text-white font-sans bg-darkGrayGR w-3/4 flex justify-between items-center py-4 px-4 my-2">
        <section>
          <div 
            className="flex flex-wrap">
            <h1 
              className="text-greenGR text-2xl">
              {repo.repoName}
            </h1>
            <p 
              className="border border-white rounded-full custom-padding text-sm ml-2">
              {repo.private ? 'private' : 'public'}
            </p>
          </div>
          <div 
             className="flex flex-wrap text-sm flex flex-start">
            <p 
              className="flex items-center mx-2">
              <span 
              className="lang-color mx-2"
              style={{background: '#d8d8d8 !important'}}/>
              {repo.mainLang}</p>
            <p>{repo.forkedFrom}</p>
            <p 
              className="flex items-center mx-2">
              <img 
                className="icon" 
                src={forks} 
                alt="" />
            {repo.numberOfForks}
            </p>
            <p>
              Last updated: {repo.updated}</p>
          </div>
        </section>
        <section>
          <button
            className={`border-2 border-greenGR hover:border-lavenderGR hover:text-lavenderGR
  ${selected.includes(repo.repoName) ? 'bg-lavenderGR text-black hover:text-black border-lavenderGR' : 'text-greenGR'} rounded-full px-8 py-2 font-semibold text-serif`}
            onClick={() => handleClick(repo.repoName)}>
            Select
          </button>
        </section>
      </div>
    ))}
    </>
  )
}

export default RepoComponent;

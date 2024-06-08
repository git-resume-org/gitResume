import React, { useState, useEffect } from 'react';
import forks from '../assets/icons/Forks.png'
import { useSelectedRepo } from './SelectedRepoProvider';

const RepoTestComp = () => {
  const { selected, handleClickSelect } = useSelectedRepo();

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
    },
    {
      repoName: 'Squilium',
      mainLang: 'TypeScript',
      private: false,
      updated: 'Mar 15',
      forkedFrom: null,
      numberOfForks: '1587'
    },
    {
      repoName: 'AIVA',
      mainLang: 'Python',
      private: true,
      updated: 'Apr 10',
      forkedFrom: 'team/AIVA',
      numberOfForks: '12'
    },
    {
      repoName: 'Vagabond',
      mainLang: 'JavaScript',
      private: true,
      updated: 'Jul 12',
      forkedFrom: 'team/Vagabond',
      numberOfForks: '3'
    },
    {
      repoName: 'tortilla',
      mainLang: 'TypeScript',
      private: false,
      updated: 'Apr 10',
      forkedFrom: null,
      numberOfForks: '58'
    },
    {
      repoName: 'cdsql',
      mainLang: 'Python',
      private: false,
      updated: 'Jan 11',
      forkedFrom: null,
      numberOfForks: '120'
    },
  ]

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
                  style={{ background: '#d8d8d8 !important' }} />
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
              onClick={() => handleClickSelect(repo.repoName)}>
              Select
            </button>
          </section>
        </div>
      ))}
    </>
  )
}

export default RepoTestComp;

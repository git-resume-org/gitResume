import React, {useState, useEffect} from 'react';
import forks from '../assets/icons/Forks.png'
import { useSelectedRepo } from './SelectedRepoProvider';

const RepoComponent = () => {
  const {selected, handleClick} = useSelectedRepo();
  const [reposToDisplay, setReposToDisplay] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/github/repos', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setReposToDisplay(data)
      })
      .catch((error) => console.error('Error fetching repos: ', error))
  }, [])

  // const checkLang = (repoArr) => {
  //   repoArr.forEach(repo => {
  //     switch (repo.mainLang) {
  //     case 'JavaScript' : 
  //       repo.mainLangColor = '#f1df5a'; break;
  //     case 'Python' : 
  //       repo.mainLangColor = '#3672a5'; break;
  //     case 'Go' : 
  //       repo.mainLangColor = '#00add8'; break;
  //     case 'TypeScript' : 
  //       repo.mainLangColor = '#3178c6'; break;
  //     case 'C#' :
  //       repo.mainLangColor = '#188600'; break;
  //     case 'Svelte':
  //       repo.mainLangColor = '#f75b2b'; break;
  //     case 'PHP':
  //       repo.mainLangColor = '#505e95'; break;
  //     case 'Java':
  //       repo.mainLangColor = '#b07219'; break;
  //     case 'Ruby' : 
  //       repo.mainLangColor = '#701516'; break;
  //     default: 
  //       repo.mainLangColor = '#d3d3d3'; break;
  //     }
  //   })
  // }

  if (reposToDisplay === null) {
    return (
      <>
    <div className="loader w-32 h-32 border-8 border-black border-t-lavenderGR rounded-full animate-spin">
    </div>
    <h2 className="text-white font-grotesk">Loading...</h2>
    </>
  )
  }

  const filteredRepos = reposToDisplay.filter(repo => 
    repo.repoName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <>
    <input
      type="text"
      placeholder="Search for a repository"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      className="w-3/4 p-2 text-white bg-blackGR border border-darkGrayGR font-grotesk outline-none active:border-greenGR focus:border-greenGR"
      />
    {filteredRepos.length > 0 ? filteredRepos.map((repo, index) => (
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
              {`Last updated: ${repo.updated.slice(0, 10)}`}</p>
          </div>
        </section>
        <section>
          <button
            className={`border-2 border-greenGR hover:border-lavenderGR hover:text-lavenderGR
  ${selected.includes(repo.repoName) ? 'bg-lavenderGR text-black hover:text-black active:text-black focus:text-black border-lavenderGR' : 'text-greenGR'} rounded-full px-8 py-2 font-semibold text-serif`}
            onClick={() => handleClick(repo.repoName)}>
            Select
          </button>
        </section>
      </div>
    )) : <div>No repositories found.</div>}
    </>
  )
}

export default RepoComponent;

import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/get-started-button';
import { useSelectedRepo } from '../components/SelectedRepoProvider';

const DataDisplay = () => {
  const { selected } = useSelectedRepo();
  const [bulletPoints, setBulletPoints] = useState([]);
  console.log('SELECTED:   ', selected);

  useEffect(() => {
    console.log('Fetching bullet points data...');
    fetch('/api/github/ghData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoName: selected })
    })
      .then(res => res.json())
      .then(data => {
        console.log('DATA DISPLAY COMPONENT: FETCHED DATA:   ', data);
        setBulletPoints(data);
      })
      .catch(err => console.error(`Error fetching bullet points for repo ${selected}. Error: ${err}`))
  }, []);

  return (
    <div>
      <header className='p-4 text-sm text-white absolute top-0 left-0 z-10'>
        <a href='/repodisplay'>← Back to repositories</a>
      </header>
      
      <main className='flex items-center justify-center h-screen bg-blackGR'>
        <div className='bg-darkGrayGR w-3/4 h-4/6 rounded-3xl pt-7 px-10 font-sans flex flex-col items-center justify-between'>
          <div>
            <h1 className='text-greenGR text-2xl mb-5'>"Yesql" repository</h1>
            <ul className='list-disc list-inside'>
              <li className='text-white my-4'>
                Used React to develop an application which mirrors the functionality of Chrome Developer Tools Styles tab but displays source file names and line numbers for all types of CSS styles, enabling faster CSS debugging and development.
              </li>
              <li className='text-white my-4'>
                Integrated DOM and CSS domains of Chrome Developer Protocol to communicate directly with browser’s functionality without abstraction layers provided by higher-level libraries and to fetch CSS property data of the target application.
              </li>
              <li className='text-white my-4'>
                Implemented Redux Toolkit, using Immer and Redux thunks to simplify state management across multiple React components, handle asynchronous HTTP and API requests, ensure immutable state update and efficient data flow.
              </li>
            </ul>
          </div>
          <Button
            className="my-8 hover:bg-lavenderGR focus:bg-blueGR"
            variant='default'
            // onClick={}
          >Copy To Clipboard</Button>
        </div>
      </main>
    </div>
  )
}

export default DataDisplay;
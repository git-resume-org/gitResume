import React from 'react';

const DataDisplay = () => {
  return (
    <div>
      <header className='p-4 text-sm text-white'>
        <a href='/repodisplay'>← Back to repositories</a>
      </header>
      
      <main>
        <div>
          <h1 className='text-greenGR'>Yesql</h1>
          <ul>
            <li className='text-white'>Bullet One</li>
            <li className='text-white'>Bullet Two</li>
            <li className='text-white'>Bullet Three</li>
          </ul>
          <button className='bg-greenGR'>Copy To Clipboard</button>
        </div>
      </main>
    </div>
  )
}

export default DataDisplay;
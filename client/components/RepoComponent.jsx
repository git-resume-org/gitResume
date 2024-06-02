import React from 'react';

const RepoComponent =() => {
  return (
    <div className="text-white font-sans bg-gray-700 w-3/4 flex justify-around items-center py-4">
      <section>
      <div className="flex flex-wrap">
        <h1 className="text-greenGR text-2xl">Yesql</h1>
        <p className="border border-white rounded-full custom-padding text-sm ml-2">private</p>
      </div>
      <div className="flex flex-wrap text-sm flex justify-around">
        <p>Javascript</p>
        <p>Forked from open-source-labs/Yesql</p>
        <p>1</p>
        <p>Updated on Mar 28</p>
      </div>
      </section>
      <section>
        <button className="border-2 border-greenGR text-greenGR rounded-full px-8 py-2 font-semibold text-serif">Select</button>
      </section>
    </div>
  )
}

export default RepoComponent;

import { useState } from 'react';

function SearchResults({ searchQuery }) {
  const data = [
    { id: 1, title: "Commission A - Budget Planning" },
    { id: 2, title: "Commission B - Project Review" },
    { id: 3, title: "Meeting - SmartMeet Kickoff" },
    { id: 4, title: "Meeting - Final Presentation" },
  ];

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-3">
      <h5>Results:</h5>
      {filteredData.length > 0 ? (
        <ul className="list-group">
          {filteredData.map(item => (
            <li key={item.id} className="list-group-item">
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No results found</p>
      )}
    </div>
  );
}

export default SearchResults;

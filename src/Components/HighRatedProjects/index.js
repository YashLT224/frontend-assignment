import React, { useState, useEffect } from 'react';
import './style.css'
function App() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); // max 5 projects per page
  const [loading, setLoading] = useState(true); // Track loading state for data fetch
  const [loadingPage, setLoadingPage] = useState(false); // Track loading state for page switch

  // Fetch the data from the provided URL
  useEffect(() => {
    setLoading(true);
    fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  // Calculate the indexes for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  // Pagination handler with loading state change
  const paginate = (pageNumber) => {
    setLoadingPage(true); // Start loading for page change
    setTimeout(()=>{
      setCurrentPage(pageNumber);
      setLoadingPage(false); // End loading once page is set
    },500)
    
  };

  return (
    <div className="App">
      <h1>Kickstarter Projects</h1>

      {/* Show loader when fetching data or switching pages */}
      {loading || loadingPage ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <table className="project-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Percentage Funded</th>
                <th>Amount Pledged</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project, index) => (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td>{project["percentage.funded"]}%</td>
                  <td>{project["amt.pledged"]?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            {[...Array(Math.ceil(projects.length / projectsPerPage))].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

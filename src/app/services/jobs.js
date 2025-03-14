export const fetchJobListings = async ({ pageParam = 1 }) => {
    const itemsPerPage = 2;
    const url = new URL(
      `http://localhost:3001/AbdelRahmanHesham/Module7/1.0.0/jobs/search/${pageParam}`
    );
    url.searchParams.append("limit", itemsPerPage);
    console.log(url.toString());
    const response = await fetch(url.toString());
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
  
    return { data, nextPage: data.length === itemsPerPage ? pageParam + 1 : null };
  };
  
  export const fetchJobDetails = async (id) => {
    const response = await fetch(`http://localhost:3001/AbdelRahmanHesham/Module7/1.0.0/jobs/${id}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };
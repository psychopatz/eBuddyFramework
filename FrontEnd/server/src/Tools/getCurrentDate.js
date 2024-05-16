  const GetCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    //const currentDate = date.toLocaleDateString('en-US', options);
    //console.log("Current Date: ", currentDate);  // Output example: Thursday, May 09, 2024

  return date.toLocaleDateString('en-US', options); // currentDate;
};

export default GetCurrentDate;

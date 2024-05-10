  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(date.toLocaleDateString('en-US', options));  // Output example: Thursday, May 09, 2024

  return new Date().toLocaleDateString();
};

export default getCurrentDate;

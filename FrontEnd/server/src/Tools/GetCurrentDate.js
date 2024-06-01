  const GetCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('en-US', options); // currentDate;
};

export default GetCurrentDate;

const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateRandomUserData = async (numberOfPeople) => {
  const apiUrl = `https://randomuser.me/api/?results=${numberOfPeople}`;

  try {
    const response = await axios.get(apiUrl);
    const peopleData = response.data.results.map((user, index) => {
      return {
        _id: index + 1,
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        gender: user.gender,
        address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`,
        phone: user.phone,
        email: user.email,
        status: Math.floor(Math.random() * 2)
      };
    });

    const jsonData = JSON.stringify(peopleData, null, 2);

    fs.writeFile('./people_data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
        return;
      }

      console.log('Script executed successfully. Data written to people_data.json');
    });
  } catch (error) {
    console.error('Error fetching data from the API:', error.message);
  } finally {
    rl.close();
  }
};

rl.question('Enter the number of users you want to generate data for: ', (answer) => {
  const numberOfPeople = parseInt(answer, 10);
  if (!isNaN(numberOfPeople) && numberOfPeople > 0) {
    generateRandomUserData(numberOfPeople);
  } else {
    console.error('Invalid input. Please enter a valid number greater than 0.');
    rl.close();
  }
});

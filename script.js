const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateRandomUserData = async (numberOfPeople, fileName) => {
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
    const filePath = path.join(__dirname, `${fileName}.json`);

    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
        return;
      }

      console.log(`Script executed successfully. Data written to ${fileName}.json`);
    });
  } catch (error) {
    console.error('Error fetching data from the API:', error.message);
  } finally {
    rl.close();
  }
};

const promptFileNameAndNumber = () => {
  rl.question('Enter the number of users you want to generate data for: ', (numberOfPeople) => {
    const sanitizedNumberOfPeople = parseInt(numberOfPeople, 10);
    if (!isNaN(sanitizedNumberOfPeople) && sanitizedNumberOfPeople > 0) {
      rl.question('Enter the name for the file: ', (fileName) => {
        const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, ''); // Remove non-alphanumeric characters
        if (sanitizedFileName) {
          const filePath = path.join(__dirname, `${sanitizedFileName}.json`);
          if (fs.existsSync(filePath)) {
            console.log(`A file with the name ${sanitizedFileName}.json already exists in the directory.`);
            rl.close();
          } else {
            generateRandomUserData(sanitizedNumberOfPeople, sanitizedFileName);
          }
        } else {
          console.error('Invalid input. Please provide a valid name.');
          rl.close();
        }
      });
    } else {
      console.error('Invalid input. Please enter a valid number greater than 0.');
      rl.close();
    }
  });
};

// Check if the file already exists
const filePath = path.join(__dirname, 'people_data.json');
if (fs.existsSync(filePath)) {
  console.log('A file with the name people_data.json already exists in the directory.');
  rl.close();
} else {
  // If the file doesn't exist, prompt the user for the number of users and file name
  promptFileNameAndNumber();
}

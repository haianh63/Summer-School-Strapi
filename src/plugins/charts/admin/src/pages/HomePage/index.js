/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from 'react';
import { Button, Layout } from '@strapi/design-system';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import  { request } from '@strapi/helper-plugin'
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js';

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );



const HomePage =  () => {
  
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState([]);
  const [age, setAge] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await request("/content-manager/collection-types/api::registered-user.registered-user", {
        method: "GET"
      }); 
      setData(processData(response.results));
      console.log(processData(response.results))
      setAge(processData(response.results).dateOfBirth.map((dob) => getAge(dob)))
    };

    fetchData();
  }, []);
  return (
    <div style={{margin: "30px"}}>
      <div style={{display:'flex', flexDirection: 'column', gap: '10px', width: '350px'}}>
        <Button variant="default" size="L" onClick={() => setCharts([...charts, drawBarChartOfExpertiseLevel(data)])}>
          Get number of people of each expertise level
        </Button>

        <Button variant="default" size="L" onClick={() => setCharts([...charts, drawPieChartOfExpertiseLevel(data)])}>
          Get percentage of each expertise level
        </Button>

        <Button variant="default" size="L" onClick={() => setCharts([...charts, drawBarChartOfAge(age)])}>
          Get number of people of each age
        </Button>

        <Button variant="default" size="L" onClick={() => setCharts([...charts, drawPieChartOfAge(age)])}>
          Get percentage of each age
        </Button>
      </div>

      <div>
        {charts.map((chart, index) => (
          <div key={index} style={{ height: '400px', margin: '20px 0'}}>
            {chart.type === 'bar' && (
              <Bar height={400} data={chart.data} options={chart.options} />
            )}

            {chart.type === 'pie' && (
                <Pie height={400} data={chart.data} options={chart.options} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
function processData(data) {
  const result = {
    firstName: [],
    lastName: [],
    dateOfBirth: [],
    organization: [],
    expertiseLevel: [],
    message: [],
  }
  
  data.map((user) => {
    result.firstName.push(user.firstName);
    result.lastName.push(user.lastName);
    result.dateOfBirth.push(user.dateOfBirth);
    result.organization.push(user.organization);
    result.expertiseLevel.push(user.expertiseLevel);
    result.message.push(user.message);
  })
  return result;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function processExpertiseLevel(expertiseLevel) {
  const result = {
    label: ['Novice', 'Intermediate', 'Advanced', 'Expert'],
    data: [0, 0, 0, 0],
  };
  for (let i = 0; i < expertiseLevel.length; i++) {
    if (expertiseLevel[i] === 'Novice') {
      result.data[0]++;
    } else if (expertiseLevel[i] === 'Intermediate') {
      result.data[1]++;
    } else if (expertiseLevel[i] === 'Advanced') {
      result.data[2]++;
    } else {
      result.data[3]++;
    }
  }
  return result;
}

function processAge(age) {
    const uniqueAge = [];
    const ageIndex = {};
    const count = [];
    for (let i = 0; i < age.length; i++) {
        if (!uniqueAge.includes(age[i])) {
            uniqueAge.push(age[i]);
            ageIndex[age[i]] = uniqueAge.length - 1;
        }
        if (ageIndex[age[i]] >= count.length) {
            count.push(1);
        } else {
            count[ageIndex[age[i]]] = count[ageIndex[age[i]]] + 1;
        }
    }

    return {
        label: uniqueAge,
        data: count
    }
}


function drawBarChartOfExpertiseLevel(data) {
  const processedExpertiseLevel = processExpertiseLevel(data.expertiseLevel);
  const dataValues = processedExpertiseLevel.data;
  const backgroundColors = '#E1359D'

  const dt = {
    labels: processedExpertiseLevel.label,
    datasets: [
      {
        label: 'Expertise Level',
        data: processedExpertiseLevel.data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        barThickness: 50, // Adjust bar thickness as needed
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
        title: {
            display: true,
            text: 'Number of people of each expertise level',
            color: 'white'
        }
    }
  };

  const chart = {
    type: 'bar',
    data: dt,
    options: options,
  };

  return chart;
}

function drawPieChartOfExpertiseLevel(data) {
    const processedExpertiseLevel = processExpertiseLevel(data.expertiseLevel);
    const dataValues = processedExpertiseLevel.data;
    const backgroundColors = dataValues.map(() => getRandomColor());
    const dt = {
        labels: processedExpertiseLevel.label,
        datasets: [
          {
            label: 'Dataset 1',
            data: processedExpertiseLevel.data,
            backgroundColor: backgroundColors,
          }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Percentage of each expertise level',
            color: 'white'
          }
        }
    }
    const chart = {
        type: 'pie',
        data: dt,
        options: options,
      };
    
    return chart;
}

function drawBarChartOfAge(age) {
    const processedAge = processAge(age.sort());
    const backgroundColors = '#EC233F'
    const dt = {
        labels: processedAge.label,
        datasets: [
          {
            label: 'Age',
            data: processedAge.data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
            barThickness: 50, // Adjust bar thickness as needed
          },
        ],
      };
    
      const options = {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
            title: {
                display: true,
                text: 'Number of people of each age',
                color: 'white'
            }
        }
      };
    
      const chart = {
        type: 'bar',
        data: dt,
        options: options,
      };
    
      return chart;
}

function drawPieChartOfAge(age) {
    const processedAge = processAge(age.sort());
    const dataValues = processedAge.data;
    const backgroundColors = dataValues.map(() => getRandomColor());
    const dt = {
        labels: processedAge.label,
        datasets: [
          {
            label: 'Dataset 1',
            data: processedAge.data,
            backgroundColor: backgroundColors,
          }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            color: 'white'
          },
          title: {
            display: true,
            text: 'Percentage of each age',
            color: 'white'
          }
        }
    }
    const chart = {
        type: 'pie',
        data: dt,
        options: options,
      };
    
    return chart;
}

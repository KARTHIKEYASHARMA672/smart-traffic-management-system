const directions = ['north', 'south', 'east', 'west'];

function getTrafficData() {
  return Math.floor(Math.random() * 100);
}

function calculateGreenTime(density) {
  return Math.floor((density / 100) * 60) + 10;
}

function calculateFuel(density, time) {
  return (density * time * 0.002).toFixed(2);
}

function calculateCO2(fuel) {
  return (fuel * 2.31).toFixed(2);
}

function simulateSmartTraffic() {
  let maxDensity = 0;
  let congestedDir = 'N/A';
  let totalVehicles = 0;
  let totalCO2 = 0;

  directions.forEach(direction => {
    const section = document.getElementById(direction);
    const density = getTrafficData();
    const time = calculateGreenTime(density);
    const fuel = calculateFuel(density, time);
    const co2 = calculateCO2(fuel);

    section.querySelector('.density').textContent = density;
    section.querySelector('.time').textContent = time;
    section.querySelector('.fuel').textContent = fuel;
    section.querySelector('.emissions').textContent = co2;

    section.classList.remove('active');
    if (density > maxDensity) {
      maxDensity = density;
      congestedDir = direction;
    }

    totalVehicles += density;
    totalCO2 += parseFloat(co2);
  });

  document.getElementById(congestedDir).classList.add('active');
  updateInsights(totalVehicles, totalCO2 / 4, congestedDir);
  document.getElementById('pedestrianStatus').textContent = 'No pedestrian detected';
  updateChart();
}

function simulateEmergencySound() {
  const emergencyDirection = directions[Math.floor(Math.random() * directions.length)];
  alert(`🚨 Emergency vehicle from ${emergencyDirection.toUpperCase()}! Prioritizing signal.`);

  directions.forEach(dir => {
    const section = document.getElementById(dir);
    section.classList.remove('active');
  });

  const section = document.getElementById(emergencyDirection);
  section.classList.add('active');
  section.querySelector('.time').textContent = 90;
  section.querySelector('.density').textContent = '🚑 EMERGENCY';
  section.querySelector('.fuel').textContent = '--';
  section.querySelector('.emissions').textContent = '--';
  document.getElementById('pedestrianStatus').textContent = 'No pedestrian detected';
}

function simulatePedestrian() {
  const pedestrianDirection = directions[Math.floor(Math.random() * directions.length)];
  const section = document.getElementById(pedestrianDirection);

  document.getElementById('pedestrianStatus').textContent = `🚶 Pedestrian at ${pedestrianDirection.toUpperCase()} crosswalk`;

  directions.forEach(dir => {
    document.getElementById(dir).classList.remove('active');
  });

  const pedestrianTime = 30;
  const density = getTrafficData();
  const fuel = calculateFuel(density, pedestrianTime);
  const co2 = calculateCO2(fuel);

  section.querySelector('.density').textContent = `${density} + 🚶`;
  section.querySelector('.time').textContent = pedestrianTime;
  section.querySelector('.fuel').textContent = fuel;
  section.querySelector('.emissions').textContent = co2;
  section.classList.add('active');

  updateInsights(density, co2, pedestrianDirection);
  updateChart();
}

function updateInsights(totalVehicles, avgCO2, congestedDir) {
  document.getElementById('totalVehicles').textContent = totalVehicles;
  document.getElementById('avgCO2').textContent = avgCO2.toFixed(2);
  document.getElementById('congestedDir').textContent = congestedDir.toUpperCase();
}

// Chart.js
const chartLabels = ['North', 'South', 'East', 'West'];
const chartCtx = document.getElementById('trafficChart').getContext('2d');
const emissionCtx = document.getElementById('emissionChart').getContext('2d');

const trafficChart = new Chart(chartCtx, {
  type: 'bar',
  data: {
    labels: chartLabels,
    datasets: [
      {
        label: 'Vehicle Count',
        data: [0, 0, 0, 0],
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'CO₂ Emissions (kg)',
        data: [0, 0, 0, 0],
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Vehicles' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'CO₂ Emissions (kg)' },
      },
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
  },
});

const emissionChart = new Chart(emissionCtx, {
  type: 'doughnut',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'CO₂ Distribution',
      data: [0, 0, 0, 0],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

function updateChart() {
  const vehicleData = directions.map(() => getTrafficData());
  const co2Data = vehicleData.map(v => calculateCO2(calculateFuel(v, calculateGreenTime(v))));

  trafficChart.data.datasets[0].data = vehicleData;
  trafficChart.data.datasets[1].data = co2Data;
  trafficChart.update();

  emissionChart.data.datasets[0].data = co2Data;
  emissionChart.update();
}

// Live Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Live Simulation Toggle
let liveInterval;
document.getElementById('liveToggle').addEventListener('change', function () {
  if (this.checked) {
    liveInterval = setInterval(simulateSmartTraffic, 3000);
  } else {
    clearInterval(liveInterval);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  simulateSmartTraffic();
});

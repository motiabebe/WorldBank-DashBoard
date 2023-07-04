const totalPopulationButton = document.querySelector('#totalPopulationButton');
const compareCountryButton = document.querySelector('#compareCountryButton');
const customPopulationButton = document.querySelector('#customPopulationButton');

const totalPopulationContainer = document.querySelector('#totalPopulationContainer');
const compareCountryContainer = document.querySelector('#compareCountryContainer');
const customPopulationContainer = document.querySelector('#customPopulationContainer');

totalPopulationButton.onclick = () => {
    totalPopulationContainer.classList.remove('d-none');
    compareCountryContainer.classList.add('d-none');
    customPopulationContainer.classList.add('d-none');
}

compareCountryButton.onclick = () => {
    totalPopulationContainer.classList.add('d-none');
    compareCountryContainer.classList.remove('d-none');
    customPopulationContainer.classList.add('d-none');
}

customPopulationButton.onclick = () => {
    totalPopulationContainer.classList.add('d-none');
    compareCountryContainer.classList.add('d-none');
    customPopulationContainer.classList.remove('d-none');
}
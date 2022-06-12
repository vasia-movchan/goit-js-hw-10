import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(searchCountryByName, DEBOUNCE_DELAY)
);

function searchCountryByName(event) {
  const nameCountry = event.target.value.trim();

  if (nameCountry) {
    fetchCountries(nameCountry).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 3000,
          }
        );
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
      } else if (data.length === 1) {
        //Виведення повідомлення про одну країну
        renderCountryInfo(data);
        languagesList(...data);
      } else {
        //Виведення списку країн
        renderCountryList(data);
      }
    });
  } else {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
}

function renderCountryList(countries) {
  const countryListMarkup = countries.reduce(
    (acc, { flags: { svg }, name }) =>
      acc + `<li><img src="${svg}" class="country-flag"> ${name}</li>`,
    ''
  );
  refs.countryList.innerHTML = countryListMarkup;
  refs.countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const countryMarkup = country.reduce(
    (acc, { flags: { svg }, name, capital, population }) =>
      acc +
      `<div class="wrapper-name-country">
      <img src="${svg}" class="country-flag" />
      <h2 class="country-name">${name}</h2>
      </div>
      <p class="title">Capital: <span>${capital}</span></p>
      <p class="title">Population: <span>${population}</span></p>
      <p class="title">Languages: <span>${languagesList(
        ...country
      )}</span></p>`,
    ''
  );
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = countryMarkup;
}

function languagesList(country) {
  const lang = country.languages;
  const langList = lang.map(ln => ln.name).join(', ');
  return langList;
}

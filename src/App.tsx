import React from "react";
import "./App.css";
import Geonames from "geonames.js";

const geonames = new Geonames({
  username: "myusername",
  lan: "en",
  encoding: "JSON",
});

const App: React.FC = () => {
  const [countries, setCountries] = React.useState();
  const [selectedCountry, setSelectedCountry] = React.useState({
    value: "US",
    label: "United States",
  });
  const [states, setStates] = React.useState();

  React.useEffect(() => {
    getCountries().then(response => {
      setCountries(response);
      getState(selectedCountry.value).then((statesArray: any) => {
        setStates(statesArray);
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry({ value: e.target.value, label: e.target.id });
    getState(e.target.value).then(response => {
      setStates(response);
    });
  };

  return (
    <div className="App">
      <select value={selectedCountry.value} onChange={handleChange}>
        {countries
          ? countries.map((country: any, i: number) => {
              return (
                <option
                  key={i}
                  value={country.value}
                  label={country.label}
                  id={country.label}
                />
              );
            })
          : null}
      </select>
      {states ? (
        <select value={selectedCountry.value}>
          {states.map((state: any, i: number) => {
            return (
              <option
                key={i}
                value={state.value}
                label={state.label}
                id={state.label}
              />
            );
          })}
        </select>
      ) : null}
    </div>
  );
};

export default App;

const getCountries = async () => {
  const countries = await geonames.countryInfo({}); //get continents
  const countryObj = await countries.geonames.map((obj: any) => ({
    value: obj.countryCode,
    label: obj.countryName,
  }));
  return countryObj;
};

const getState = async (countryValue = "US") => {
  if (!countryValue) {
    return [];
  }
  const countries = await geonames.countryInfo({}); //get continents

  const country = countries.geonames.find(
    (obj: any) => obj.countryCode === countryValue,
  );
  const states = await geonames.children({
    geonameId: country.geonameId,
  });

  return states.geonames.map((state: any) => ({
    value: state.adminCode1,
    label: state.name,
  }));
};

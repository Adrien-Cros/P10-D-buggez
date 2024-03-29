import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      const eventData = await api.loadData();
      setData(eventData);
      if (eventData && eventData.events.length > 0) { 
        const mostRecentByDate = eventData.events.reduce((prev, current) =>
        new Date(current.date) > new Date(prev.date) ? current : prev)
        setLast(mostRecentByDate)
      }
    } catch (err) {
      setError(err);
    }
  }, []);
  
  useEffect(() => {
    if (!data) {
      getData(); 
    }
  }, []);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;

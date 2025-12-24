import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const MainPage = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products?limit=10&skip=10&select=title,price",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Main Page</h2>
      <p>Welcome! You are logged in.</p>
      <button onClick={logout}>Logout</button>
      <h3>Products:</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;

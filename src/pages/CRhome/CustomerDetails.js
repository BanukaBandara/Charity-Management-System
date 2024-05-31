import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomerDetails = () => {
  const { nic } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/customers/${nic}`)
      .then(response => {
        setCustomer(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.response ? error.response.data : "An error occurred");
        setLoading(false);
      });
  }, [nic]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Customer Details</h1>
      {customer && (
        <div>
          <p><strong>ID:</strong> {customer.idd}</p>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>ID Number:</strong> {customer.nic}</p>
          <p><strong>Request Type:</strong> {customer.requestType}</p>
          <p><strong>What You Want:</strong> {customer.want}</p>
          <p><strong>Cash:</strong> {customer.cash}</p>
          <p><strong>Item:</strong> {customer.item}</p>
          <p><strong>Request:</strong> {customer.request}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

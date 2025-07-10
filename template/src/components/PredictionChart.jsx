import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function PredictionChart() {
  const [data, setData] = useState([]);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());

  // Récupérer les données de prédiction
  const fetchPredictionData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/prediction');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données de prédiction');
      }
      const data = await response.json();
      const formattedData = data.map(item => ({
        name: item.month,
        meetings: item.meetings,
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de prédiction:', error);
    }
  };

  // Récupérer le total des réunions annuelles
  const fetchTotalMeetings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/meetings/count');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du total des réunions');
      }
      const result = await response.json();
      setTotalMeetings(result.total_meetings);
      setYear(result.year);
    } catch (error) {
      console.error('Erreur lors de la récupération du total des réunions:', error);
    }
  };

  useEffect(() => {
    fetchPredictionData();
    fetchTotalMeetings();
  }, []);

  return (
    <div className="mt-5 p-4 shadow rounded bg-white">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Courbe de prédiction des réunions</h3>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow">
          Total {year} : <strong>{totalMeetings}</strong> réunions
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="meetings"
            stroke="#007bff"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionChart;

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import React from 'react'

const LevelPie = () => {
    const monthlyData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4780 },
  { month: "May", revenue: 5890 },
  { month: "Jun", revenue: 6390 },
  { month: "Jul", revenue: 7490 }
];

  return (
    <div>
 <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={monthlyData}>
      <CartesianGrid />
      <Line dataKey="revenue" />
      <XAxis dataKey="month" />
      <YAxis />
      <Legend />
    </LineChart>
    </div>
  )
}

export default LevelPie

import Table from "@mui/joy/Table";
import React, { useEffect, useState } from "react";

interface ChildProps {
  personalityData: { [name: string]: { rank: number; key_trait: string } };
}

const TopEmployeeTable: React.FC<ChildProps> = ({ personalityData }) => {
  const [data, setData] = useState(personalityData);
  useEffect(() => {
    setData(personalityData);
  }, [personalityData]);

  return (
    <Table aria-label="basic table">
      <thead>
        <tr>
          <th style={{ width: "15%" }}>Rank</th>
          <th style={{ width: "50%" }}>Name </th>
          <th style={{ width: "35%" }}>Key Trait</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([name, data]) => (
          <tr key={name}>
            <td>{data.rank}</td>
            <td>{name}</td>
            <td>{data.key_trait || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TopEmployeeTable;

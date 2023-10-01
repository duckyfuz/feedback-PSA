import { Button, Typography } from "@mui/joy";
import Table from "@mui/joy/Table";

const TopEmployeeTable = ({ personalityData, viewHandler }: any) => {
  const employeeData = personalityData.ranking;
  // console.log(employeeData);
  return (
    <Table aria-label="basic table">
      <thead>
        <tr>
          <th style={{ width: "10%" }}>Rank</th>
          <th style={{ width: "15%" }}>Employee</th>
          <th style={{ width: "75%" }}>Employee Report</th>
          <th style={{ width: "10%" }}></th>
        </tr>
      </thead>
      <tbody>
        {employeeData &&
          employeeData.map((entry: any, index: any) => {
            const employeeName = entry[0];
            const feedbackText = entry[1];

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{employeeName}</td>
                <td>
                  <Typography noWrap level="body-xs">
                    {feedbackText}
                  </Typography>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      viewHandler(index);
                    }}
                  >
                    View
                  </Button>
                </td>
                {/* <td>{feedbackText}</td> */}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default TopEmployeeTable;

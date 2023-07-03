import { getConfigs } from "@/requests";
import { StatusOfflineIcon, StatusOnlineIcon } from "@heroicons/react/outline";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Badge,
} from "@tremor/react";
import { useEffect, useState } from "react";

export default () => {
  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const configs = await getConfigs();
      setConfigs(configs);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [setConfigs]);
  return (
    <Card decoration="top">
      <Title>Status of detected configurations</Title>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Source</TableHeaderCell>
            <TableHeaderCell>Analysis</TableHeaderCell>
            <TableHeaderCell>Identified timeseries</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {configs.map((config) => (
            <TableRow
              key={`${config.analysis_id}_${config.timseries_id}_${config.connector_id}`}
            >
              <TableCell>
                <Text>{config.connector_name}</Text>
              </TableCell>
              <TableCell>
                <Text>{config.analysis_name}</Text>
              </TableCell>
              <TableCell>
                <Text>{config.timeseries_identifier}</Text>
              </TableCell>
              <TableCell>
                <Badge
                  color="emerald"
                  icon={
                    config.dataPointCount ? StatusOnlineIcon : StatusOfflineIcon
                  }
                >
                  {`Analyzing ${config.dataPointCount} data points`}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

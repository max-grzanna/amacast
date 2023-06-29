"use client";

import moment from "moment";
import {
  Text,
  Card,
  Grid,
  Icon,
  Col,
  Select,
  SelectItem,
  Flex,
  Title,
  Subtitle,
  Button,
  BadgeDelta,
  Metric,
  ProgressBar,
  Badge,
} from "@tremor/react";
import { PuzzleIcon } from "@heroicons/react/outline";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  getWarnings,
  getConfigs,
  getTrends,
  triggerAnalysis,
} from "@/requests";
import ConfigsTable from "../setup/ConfigsTable";

const optionsToArray = (options) => {
  if (Array.isArray(options)) {
    return options;
  }
  return Object.entries(options).map(([type, option]) => ({
    type,
    ...option,
  }));
};

export const Dashboard = () => {
  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const configs = await getConfigs();
      setConfigs(configs);
      await triggerAnalysis();
    };
    fetchData();
  }, [setConfigs]);
  const getConfig = ({ connector_id, analysis_id, timeseries_id }) => {
    return configs.find((config) => {
      return (
        config.analysis_id === analysis_id &&
        config.timeseries_id === timeseries_id
      );
    });
  };
  const [warnings, setWarnings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const configs = await getWarnings();
      setWarnings(configs);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [setWarnings]);

  return (
    <div>
      <a href="/setup">
        <Button variant="light" icon={PuzzleIcon}>
          Konfiguration
        </Button>
      </a>

      <Flex className="mt-10">
        <Card decoration="top">
          <Title>Anomalies</Title>
          <Grid
            numItems={1}
            numItemsSm={1}
            numItemsLg={3}
            className="gap-6 mt-6"
          >
            {warnings.map((warning) => {
              const config = getConfig(warning);
              return (
                <Col key={warning.id}>
                  <Card className="max-w-lg mx-auto">
                    <Flex alignItems="start">
                      <div>
                        <Text>{`${config?.analysis_name}`}</Text>
                        <Title>{`${config?.timeseries_identifier} (${config?.connector_name})`}</Title>
                      </div>
                      <Badge color="red" size="xs">
                        Open
                      </Badge>
                    </Flex>
                    <Flex className="mt-4">
                      <Text className="truncate">
                        {moment(warning.timestamp_start).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </Text>
                      <Text className="truncate">
                        {moment(warning.timestamp_end).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </Text>
                    </Flex>
                    <ProgressBar value={0} className="mt-2" />
                  </Card>
                </Col>
              );
            })}
          </Grid>
        </Card>
      </Flex>

      <Flex className="mt-10">
        <ConfigsTable />
      </Flex>
    </div>
  );
};

export default Dashboard;

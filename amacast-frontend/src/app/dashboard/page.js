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
  patchWarning,
} from "@/requests";
import ConfigsTable from "../setup/ConfigsTable";
import { WarningCard } from "./WarningCard";
import { TrendCard } from "./TrendCard";

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
      const warnings = await getWarnings();
      setWarnings(warnings);
      const trends = await getTrends();
      setTrends(trends);
      await triggerAnalysis();
      const warnings2 = await getWarnings();
      setWarnings(warnings2);
      const trends2 = await getTrends();
      setTrends(trends2);
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
      const data = await getWarnings();
      setWarnings(data);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [setWarnings]);
  const [trends, setTrends] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrends();
      setTrends(data);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [setTrends]);
  const onReactWarning = useCallback((warningId) => async () => {
    await patchWarning({
      id: warningId,
      reaction_at: new Date(),
    });
    const warnings = await getWarnings();
    setWarnings(warnings);
  });

  return (
    <div>
      <a href="/setup">
        <Button variant="light" icon={PuzzleIcon}>
          Konfiguration
        </Button>
      </a>

      <Flex className="mt-10">
        <WarningCard
          warnings={warnings}
          getConfig={getConfig}
          onReactWarning={onReactWarning}
        />
      </Flex>
      <Flex className="mt-10">
        <TrendCard trends={trends} getConfig={getConfig} />
      </Flex>

      <Flex className="mt-10">
        <ConfigsTable />
      </Flex>
    </div>
  );
};

export default Dashboard;

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

export const WarningCard = ({ warnings, getConfig }) => {
  return (
    <Card decoration="top">
      <Title>Warnings</Title>
      <Grid numItems={1} numItemsSm={1} numItemsLg={3} className="gap-6 mt-6">
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
                    {moment(warning.timestamp_start).format("YYYY-MM-DD HH:mm")}
                  </Text>
                  <Text className="truncate">
                    {moment(warning.timestamp_end).format("YYYY-MM-DD HH:mm")}
                  </Text>
                </Flex>
                <ProgressBar value={0} className="mt-2" />
              </Card>
            </Col>
          );
        })}
      </Grid>
    </Card>
  );
};

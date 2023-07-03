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
import { CheckIcon, SearchIcon, VolumeOffIcon } from "@heroicons/react/solid";

export const WarningCard = ({ warnings, getConfig, onReactWarning }) => {
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
                <Flex justifyContent="between" className="gap-2 mt-5">
                  <Select>
                    <SelectItem value={"ignore"} icon={VolumeOffIcon}>
                      Ignore
                    </SelectItem>
                    <SelectItem value={"resolve"} icon={CheckIcon}>
                      Resolve
                    </SelectItem>
                  </Select>
                  {warning.id || warning.id === 0 ? (
                    <Button
                      variant="secondary"
                      onClick={onReactWarning(warning.id)}
                    >
                      Save
                    </Button>
                  ) : null}
                  <a
                    target="_blank"
                    href={
                      config?.ref_url ||
                      "https://monit-grafana-open.cern.ch/d/TUKgUEcnz/ru-rrc-ki-t1?orgId=16"
                    }
                  >
                    <Button variant="secondary" icon={SearchIcon}>
                      Explore
                    </Button>
                  </a>
                </Flex>
              </Card>
            </Col>
          );
        })}
      </Grid>
    </Card>
  );
};

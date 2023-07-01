"use client";

import moment from "moment";
import {
  Card,
  Icon,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  Title,
  Flex,
  Select,
  SelectItem,
  MultiSelect,
  MultiSelectItem,
  DeltaType,
  Badge,
  ProgressBar,
  Text,
  LineChart,
} from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "@heroicons/react/outline";
import { TrendRow } from "./TrendRow";

const trendTypeMap = {
  upper_limit: {
    Icon: TrendingUpIcon,
    deltaType: "moderateIncrease",
    label: "Reaching Upper Limit",
  },
  lower_limit: {
    Icon: TrendingDownIcon,
    deltaType: "moderateDecrease",
    label: "Reaching Lower Limit",
  },
};

export const TrendCard = ({ trends, getConfig }) => {
  return (
    <Card decoration="top">
      <Title>Trends</Title>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Analyse</TableHeaderCell>
            <TableHeaderCell>Timeseries</TableHeaderCell>
            <TableHeaderCell>Source</TableHeaderCell>
            <TableHeaderCell>Trend</TableHeaderCell>
            <TableHeaderCell>Limit</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {trends.map((item) => {
            const config = getConfig(item);
            return <TrendRow key={item.id} trend={item} config={config} />;
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

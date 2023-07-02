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
import { useState, useEffect } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "@heroicons/react/outline";
import { getTimeseriesData } from "@/requests";
import filter from "lodash/filter";
import sampleSize from "lodash/sampleSize";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import sum from "lodash/sum";

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

const getProgress = (item) => {
  const { timestamp, created_at = moment().subtract(1, "month") } = item;
  const start = moment(created_at).subtract(3, "month").toDate().getTime();
  const now = new Date().getTime();
  const end = new Date(timestamp).getTime();
  const progress = Math.round(((now - start) / (end - start)) * 100);
  return {
    formattedStart: moment(new Date(created_at)).format("DD.MM.YYYY"),
    formattedEnd: moment(new Date(timestamp)).format("DD.MM.YYYY"),
    value: progress,
  };
};

const dataFormatter = (number) => `${number}`;

export const TrendRow = ({ trend, config }) => {
  const progress = getProgress(trend);

  const [showLineChart, setShowLineChart] = useState(false);
  const toggleLineChart = () => setShowLineChart(!showLineChart);

  const [timeseriesData, setTimeseriesData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTimeseriesData(trend.timeseries_id);
      setTimeseriesData(data);
    };
    fetchData();
  }, [setTimeseriesData]);

  const groupedData = groupBy(timeseriesData, (item) =>
    moment(item.timestamp).format("YYYY-MM-DD")
  );
  const sampledData = Object.entries(groupedData).reduce(
    (result, [timeKey, item]) => {
      result.push({
        timestamp: Math.round(
          sum(item.map((item) => +new Date(item.timestamp))) / item.length
        ),
        value: sum(item.map((item) => item.value)) / item.length,
      });
      return result;
    },
    []
  );

  const lineChartData = sampledData.map((item) => {
    return {
      timestamp: `${moment(item.timestamp).format("  DD.MM.  ")}`,
      value: item.value,
      upper_limit: trend?.upper_limit || config?.analysis_upper_limit,
      lower_limit: trend?.lower_limit || config?.analysis_lower_limit,
    };
  });

  return [
    <TableRow key={trend.id} onClick={toggleLineChart}>
      <TableCell>{`${config?.analysis_name}`}</TableCell>
      <TableCell>{`${config?.timeseries_identifier}`}</TableCell>
      <TableCell>{`${config?.connector_name}`}</TableCell>
      <TableCell>
        <Badge color={"amber"} icon={trendTypeMap[trend.trend_type]?.Icon}>
          {trendTypeMap[trend.trend_type]?.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Flex className="mt-4 space-x-2">
          <Text className="truncate">{`${progress?.value}% (${progress?.formattedStart})`}</Text>
          <Text>{progress?.formattedEnd || ""}</Text>
        </Flex>
        <ProgressBar value={progress?.value} className="mt-2" />
      </TableCell>
    </TableRow>,
    showLineChart ? (
      <TableRow key={trend.name + "bla"}>
        <TableCell colSpan={5}>
          <LineChart
            className="mt-6 w-full"
            data={lineChartData}
            index="timestamp"
            categories={["value", "upper_limit", "lower_limit"]}
            colors={["emerald", "red", "red"]}
            valueFormatter={dataFormatter}
            yAxisWidth={60}
            showLegend={false}
            showXAxis={true}
          />
        </TableCell>
      </TableRow>
    ) : null,
  ];
};

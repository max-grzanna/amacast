"use client";

import {
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { Card, Text, Metric, Flex, ProgressBar, Icon } from "@tremor/react";
import {
  DocumentReportIcon,
  PresentationChartLineIcon,
  SparklesIcon,
} from "@heroicons/react/outline";

export const Setup = () => {
  return (
    <Card className="col-span-full p-2">
      <Tabs value="none">
        <TabsHeader>
          <Tab disabled value={"connector"}>
            <div className="flex items-center gap-2">
              <Icon icon={DocumentReportIcon} />
              Source
            </div>
          </Tab>
          <Tab disabled value={"analysis"}>
            <div className="flex items-center gap-2">
              <Icon icon={SparklesIcon} />
              Analysis
            </div>
          </Tab>
          <Tab disabled value={"reporting"}>
            <div className="flex items-center gap-2">
              <Icon icon={PresentationChartLineIcon} />
              Reporting
            </div>{" "}
          </Tab>
        </TabsHeader>
      </Tabs>
    </Card>
  );
};

export default Setup;

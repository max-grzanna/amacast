"use client";

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
  Button,
  List,
  ListItem,
  Divider,
  Subtitle,
} from "@tremor/react";
import {
  DocumentReportIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  PlusIcon,
  DatabaseIcon,
  TrendingUpIcon,
  LightningBoltIcon,
  PencilIcon,
  InboxInIcon,
  BellIcon,
  SupportIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/outline";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { LabeledTextInput } from "./sourceConfig/page";
import { compact, isEmpty, pick } from "lodash";
import {
  getConnectors,
  postConnector,
  triggerAnalysis,
  triggerIngest,
} from "@/requests";
import ConfigsTable from "./ConfigsTable";

export const ConnectorDialog = ({
  isDialogOpen,
  handleOpen,
  dialogFields,
  setDialogField,
  add,
}) => {
  return (
    <Dialog open={isDialogOpen} handler={() => handleOpen(null)}>
      <Flex justifyContent="center" alignItems="center" className="mt-10">
        <Card className="max-w-xl auto" decoration="top">
          <DialogHeader>
            <Title>CSV Download Connector Configuration</Title>
          </DialogHeader>
          <DialogBody divider>
            <List className="mt-2">
              <ListItem>
                <LabeledTextInput
                  onChange={setDialogField("name")}
                  value={dialogFields.name || ""}
                  label="Name"
                  placeholder="Human readable name"
                />
              </ListItem>
              <ListItem>
                <LabeledTextInput
                  onChange={setDialogField("download_url")}
                  value={dialogFields.download_url || ""}
                  label="Download URL"
                  placeholder="Download url for a csv with timeseries data"
                />
              </ListItem>
              <ListItem>
                <LabeledTextInput
                  onChange={setDialogField("ref_url")}
                  value={dialogFields.ref_url || ""}
                  label="Reference URL"
                  placeholder="Reference URL, e.g. to the internal data visualization tool"
                />
              </ListItem>
            </List>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => handleOpen(null)}>Cancel</Button>
            <Button className="ml-4" onClick={add}>
              Save
            </Button>
          </DialogFooter>
        </Card>
      </Flex>
    </Dialog>
  );
};

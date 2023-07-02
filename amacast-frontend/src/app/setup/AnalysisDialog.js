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
import { compact, isEmpty, pick, set } from "lodash";
import {
  getConnectors,
  postConnector,
  triggerAnalysis,
  triggerIngest,
} from "@/requests";
import ConfigsTable from "./ConfigsTable";

export const AnalysisDialog = ({
  isDialogOpen,
  type,
  handleOpen,
  dialogFields,
  setDialogField,
  add,
}) => {
  console.log("AnalysisDialog", type, dialogFields);

  return (
    <Dialog open={isDialogOpen} handler={() => handleOpen(null)}>
      <Flex justifyContent="center" alignItems="center" className="mt-10">
        <Card className="max-w-xl auto" decoration="top">
          <DialogHeader>
            {type === "trend" && <Title>Trend Detection Configuration</Title>}
            {type === "change_point" && (
              <Title>Change Point Detection Configuration</Title>
            )}
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
                  onChange={setDialogField("identifier_matcher")}
                  value={dialogFields.identifier_matcher || ""}
                  label="Data identifier matcher"
                  placeholder="(opt) e.g. %System_Fan%"
                />
              </ListItem>
              {type === "trend" && (
                <ListItem>
                  <LabeledTextInput
                    onChange={setDialogField("upper_limit")}
                    value={dialogFields.upper_limit || ""}
                    label="Upper Bound"
                    placeholder="(opt) Enter a known upper bound for a long term trend prediction"
                  />
                </ListItem>
              )}
              {type === "trend" && (
                <ListItem>
                  <LabeledTextInput
                    onChange={setDialogField("lower_limit")}
                    value={dialogFields.lower_limit || ""}
                    label="Lower Bound"
                    placeholder="(opt) Enter a known lower bound for a long term trend prediction"
                  />
                </ListItem>
              )}
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

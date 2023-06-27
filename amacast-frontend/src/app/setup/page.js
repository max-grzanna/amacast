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
import { Fragment, useCallback, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { LabeledTextInput } from "./sourceConfig/page";
import { compact, isEmpty } from "lodash";

const connectors = [
  {
    value: "influxDb",
    icon: DatabaseIcon,
    label: "Influx DB",
    disabled: true,
  },
  {
    value: "csvDownload",
    icon: DatabaseIcon,
    label: "CSV Download",
  },
  {
    value: "timescaleDb",
    icon: DatabaseIcon,
    label: "Timescale DB",
    disabled: true,
  },
];

const analysis = [
  {
    value: "changePointDetection",
    icon: LightningBoltIcon,
    label: "Change Point Detection",
  },
  {
    value: "trend",
    icon: TrendingUpIcon,
    label: "Trend Detection",
  },
  {
    value: "custom",
    icon: PencilIcon,
    label: "Custom",
  },
];

const reporting = [
  {
    value: "email",
    icon: InboxInIcon,
    label: "Email",
  },
  {
    value: "icinga",
    icon: BellIcon,
    label: "Icinga Alert",
  },
  {
    value: "serviceDesk",
    icon: SupportIcon,
    label: "Service Desk",
  },
];

export const SelectAdd = ({
  options = [],
  addButtonIcon = PlusIcon,
  addButtonLabel = "Add",
  onAddClick,
  onAddLink,
}) => {
  const [selected, setSelected] = useState(undefined);
  const [selectError, setSelectorError] = useState(undefined);

  const onChangeSelect = useCallback(
    (value) => {
      setSelected(value);
      if (!value || value === "none") {
        setSelectorError(true);
      } else {
        setSelectorError(false);
      }
    },
    [setSelectorError]
  );

  const onAddButtonClick = useCallback(() => {
    console.log("onAddButtonClick", selected);
    if (!selected) {
      setSelectorError(true);
      return;
    }
    if (!onAddClick) {
      return;
    }
    onAddClick("csvDownload");
  }, [onAddClick, selected]);

  return (
    <Flex justifyContent="between" className="gap-2">
      <Select
        className={selectError ? "border-red-600 border-2" : undefined}
        onChange={onChangeSelect}
      >
        {options.map(({ value, icon, label, disabled }) => (
          <SelectItem key={value} value={value} icon={icon} disabled={disabled}>
            {label}
          </SelectItem>
        ))}
      </Select>
      <a href={onAddLink ? onAddLink : undefined}>
        <Button
          icon={addButtonIcon}
          onClick={onAddButtonClick}
          disabled={!selected}
        >
          {addButtonLabel}
        </Button>
      </a>
    </Flex>
  );
};

const analysisItems = [
  {
    name: "General Anomaly Detection",
    type: "Change Point Detection",
  },
  {
    name: "Long-term Trend Analysis",
    type: "Trend Detection",
  },
];

const reportingItems = [
  {
    name: "Dashboard",
    type: "Preconfigured Reporting View",
  },
];

export const ConfigurationList = ({ items = [], ...rest }) => {
  if (!items || isEmpty(items)) {
    return (
      <Flex {...rest}>
        <Card {...rest} className="pt-2 pb-2">
          <Text>No Source configured</Text>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex {...rest}>
      <Card {...rest} className="pt-2 pb-2">
        <List>
          {items.map((item, i) => {
            const subtitle = compact([
              item.type,
              ...Object.values(item.config || {}),
            ]).join(" - ");
            return (
              <ListItem key={i}>
                <Flex alignItems="between">
                  <Flex flexDirection="col" alignItems="start">
                    <Title>{item.name}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                  </Flex>
                  <Button
                    className="pr-2 pl-10"
                    variant="light"
                    icon={ArrowRightIcon}
                  ></Button>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Flex>
  );
};

export const Setup = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setIsDialogOpen(!isDialogOpen);
  }, [isDialogOpen, setIsDialogOpen]);

  const [dialogFields, setDialogFields] = useState({});
  const setDialogField = useCallback(
    (field) => (event) => {
      setDialogFields({
        ...dialogFields,
        [field]: event.target.value,
      });
    },
    [dialogFields, setDialogFields]
  );

  const [connectorItems, setConnectorItems] = useState([]);
  const addConnectorItem = useCallback(() => {
    setConnectorItems([
      ...connectorItems,
      {
        name: dialogFields.name,
        type: "CSV Download",
        config: {
          downloadUrl: dialogFields.downloadUrl,
        },
      },
    ]);
    handleOpen();
    setDialogFields({});
  }, [
    connectorItems,
    setConnectorItems,
    dialogFields,
    setDialogFields,
    handleOpen,
  ]);

  return (
    <div>
      <a href="/dashboard">
        <Button variant="light" icon={ArrowLeftIcon}>
          Zurück zum Dashboard
        </Button>
      </a>
      <Grid numItems={1} numItemsSm={1} numItemsLg={3} className="gap-6 mt-6">
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={DocumentReportIcon} />
            <Title>Source</Title>
          </Flex>
          <SelectAdd options={connectors} onAddClick={handleOpen} />
          <ConfigurationList items={connectorItems} className="mt-4" />
        </Col>
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={SparklesIcon} />
            <Title>Analysis</Title>
          </Flex>
          <SelectAdd options={analysis} />
          <ConfigurationList items={analysisItems} className="mt-4" />
        </Col>
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={PresentationChartLineIcon} />
            <Title>Reporting</Title>
          </Flex>
          <SelectAdd options={reporting} />
          <ConfigurationList items={reportingItems} className="mt-4" />
        </Col>
      </Grid>
      <Dialog open={isDialogOpen} handler={handleOpen}>
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
                    onChange={setDialogField("downloadUrl")}
                    value={dialogFields.downloadUrl || ""}
                    label="Download URL"
                    placeholder="Download url for a csv with timeseries data"
                  />
                </ListItem>
              </List>
            </DialogBody>
            <DialogFooter>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button className="ml-4" onClick={addConnectorItem}>
                Save
              </Button>
            </DialogFooter>
          </Card>
        </Flex>
      </Dialog>
    </div>
  );
};

export default Setup;

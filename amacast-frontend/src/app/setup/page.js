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
import { getConnectors, postConnector } from "@/requests";

const optionsToArray = (options) => {
  if (Array.isArray(options)) {
    return options;
  }
  return Object.entries(options).map(([type, option]) => ({
    type,
    ...option,
  }));
};

const connectorOptions = {
  influx_db: {
    icon: DatabaseIcon,
    label: "Influx DB",
    disabled: true,
  },
  csv_download: {
    icon: DatabaseIcon,
    label: "CSV Download",
  },
  timescale_db: {
    icon: DatabaseIcon,
    label: "Timescale DB",
    disabled: true,
  },
};

const analysisOptions = [
  {
    type: "changePointDetection",
    icon: LightningBoltIcon,
    label: "Change Point Detection",
  },
  {
    type: "trend",
    icon: TrendingUpIcon,
    label: "Trend Detection",
  },
  {
    type: "custom",
    icon: PencilIcon,
    label: "Custom",
  },
];

const reportingOptions = [
  {
    type: "email",
    icon: InboxInIcon,
    label: "Email",
  },
  {
    type: "icinga",
    icon: BellIcon,
    label: "Icinga Alert",
  },
  {
    type: "serviceDesk",
    icon: SupportIcon,
    label: "Service Desk",
  },
];

export const SelectAdd = ({
  options: inOptions = [],
  addButtonIcon = PlusIcon,
  addButtonLabel = "Add",
  onAddClick,
  onAddLink,
}) => {
  const options = optionsToArray(inOptions) || [];
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
    if (!selected) {
      setSelectorError(true);
      return;
    }
    if (!onAddClick) {
      return;
    }
    onAddClick(selected);
  }, [onAddClick, selected]);

  return (
    <Flex justifyContent="between" className="gap-2">
      <Select
        className={selectError ? "border-red-600 border-2" : undefined}
        onChange={onChangeSelect}
      >
        {options.map(({ type, icon, label, disabled }) => (
          <SelectItem key={type} value={type} icon={icon} disabled={disabled}>
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

export const ConfigurationList = ({
  options = {},
  items: inItems = [],
  ...rest
}) => {
  const items = inItems.filter((item) => item.type);

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
              options?.[item.type]?.label || item.type,
              ...compact(
                Object.values(pick(item || {}, ["download_url", "ref_url"]))
              ),
            ]).join(" - ");
            return (
              <ListItem key={i}>
                <Flex alignItems="between">
                  <Flex
                    flexDirection="col"
                    alignItems="start"
                    className="max-w-sm"
                  >
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

  /*
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
  */
  const [connectors, setConnectors] = useState([]);
  const addConnector = useCallback(async () => {
    const connector = await postConnector({
      ...dialogFields,
      type: "csv_download",
    });
    const connectors = await getConnectors();
    setConnectors(connectors);
    handleOpen();
    setDialogFields({});
  }, [dialogFields, setDialogFields, handleOpen]);
  useEffect(() => {
    const fetchData = async () => {
      const connectors = await getConnectors();
      setConnectors(connectors);
    };
    fetchData();
  }, [setConnectors]);

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
          <SelectAdd options={connectorOptions} onAddClick={handleOpen} />
          <ConfigurationList
            options={connectorOptions}
            items={connectors}
            className="mt-4"
          />
        </Col>
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={SparklesIcon} />
            <Title>Analysis</Title>
          </Flex>
          <SelectAdd options={analysisOptions} />
          <ConfigurationList items={analysisItems} className="mt-4" />
        </Col>
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={PresentationChartLineIcon} />
            <Title>Reporting</Title>
          </Flex>
          <SelectAdd options={reportingOptions} />
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
              <Button onClick={handleOpen}>Cancel</Button>
              <Button className="ml-4" onClick={addConnector}>
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

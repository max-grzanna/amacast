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
import { compact, get, isEmpty, pick } from "lodash";
import {
  getAnalysis,
  getConnectors,
  patchAnalysis,
  patchConnector,
  postAnalysis,
  postConnector,
  triggerAnalysis,
  triggerIngest,
} from "@/requests";
import ConfigsTable from "./ConfigsTable";
import { ConnectorDialog } from "./ConnectorDialog";
import { AnalysisDialog } from "./AnalysisDialog";

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

const analysisOptions = {
  change_point: {
    icon: LightningBoltIcon,
    label: "Change Point Detection",
  },
  trend: {
    icon: TrendingUpIcon,
    label: "Trend Detection",
  },
  custom: {
    icon: PencilIcon,
    label: "Custom",
  },
};

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
  onOpen,
  ...rest
}) => {
  const items = inItems.filter((item) => item.type);

  if (!items || isEmpty(items)) {
    return (
      <Flex {...rest}>
        <Card {...rest} className="pt-2 pb-2">
          <Text>None configured</Text>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex {...rest}>
      <Card {...rest} className="pt-2 pb-2">
        <List>
          {items.map((item, i) => {
            const subtitleItems = [
              options?.[item.type]?.label || item.type,
              Object.values(
                pick(item || {}, [
                  "download_url",
                  "ref_url",
                  "identifier_matcher",
                ])
              ),
            ];
            if (item.upper_limit) {
              subtitleItems.push(`Upper Limit: ${item.upper_limit}`);
            }
            if (item.lower_limit) {
              subtitleItems.push(`Lower Limit: ${item.lower_limit}`);
            }
            const subtitle = compact(
              subtitleItems.filter((item) => !isEmpty(item)).join(" - ")
            );
            return (
              <ListItem key={i}>
                <Flex alignItems="between">
                  <Flex
                    flexDirection="col"
                    alignItems="start"
                    className="max-w-xs"
                  >
                    <Title>{item.name}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                  </Flex>
                  <Button
                    onClick={
                      onOpen ? () => onOpen(item.type, item.id) : undefined
                    }
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
  const [connectors, setConnectors] = useState([]);
  const [analysis, setAnalysis] = useState([]);

  const [connectorDialogFields, setConnectorDialogFields] = useState({});
  const [analysisDialogFields, setAnalysisDialogFields] = useState({});
  const [connectorDialogOpen, setConnectorDialogOpen] = useState(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(null);

  const setConnectorDialogField = useCallback(
    (field) => (event) => {
      setConnectorDialogFields({
        ...connectorDialogFields,
        [field]: event.target.value,
      });
    },
    [connectorDialogFields, setConnectorDialogFields]
  );
  const setAnalysisDialogField = useCallback(
    (field, fieldType) => (event) => {
      if (fieldType === "direct") {
        setAnalysisDialogFields({
          ...analysisDialogFields,
          [field]: event,
        });
        return;
      }
      setAnalysisDialogFields({
        ...analysisDialogFields,
        [field]: event.target.value,
      });
    },
    [analysisDialogFields, setAnalysisDialogFields]
  );

  const isConnectorDialogOpen = Boolean(connectorDialogOpen);
  const handleConnectorDialogOpen = useCallback(
    (type, id) => {
      if (isConnectorDialogOpen) {
        setConnectorDialogOpen(null);
        return;
      }
      if (id || id === 0) {
        const item = connectors.find((c) => c.id === id);
        console.log("handleConnectorDialogOpen", { type, id, item });
        if (!item) {
          return;
        }
        setConnectorDialogFields(item);
      } else {
        setConnectorDialogFields({});
      }
      setConnectorDialogOpen(type);
    },
    [isConnectorDialogOpen, setConnectorDialogOpen, connectors]
  );

  const isAnalysisDialogOpen = Boolean(analysisDialogOpen);
  const handleAnalysisDialogOpen = useCallback(
    (type, id) => {
      if (isAnalysisDialogOpen) {
        setAnalysisDialogOpen(null);
        return;
      }
      if (id || id === 0) {
        const item = analysis.find((c) => c.id === id);
        console.log("handleAnalysisDialogOpen", { type, id, item, analysis });
        if (!item) {
          return;
        }
        setAnalysisDialogFields(item);
      } else {
        setAnalysisDialogFields({});
      }
      setAnalysisDialogOpen(type);
    },
    [isAnalysisDialogOpen, setAnalysisDialogOpen, analysis]
  );

  const addConnector = useCallback(async () => {
    if (analysisDialogFields.id || analysisDialogFields.id === 0) {
      await patchConnector({
        ...connectorDialogFields,
        type: connectorDialogOpen,
      });
    } else {
      await postConnector({
        ...connectorDialogFields,
        type: connectorDialogOpen,
      });
    }
    const connectors = await getConnectors();
    setConnectors(connectors);
    handleConnectorDialogOpen(null);
    setConnectorDialogFields({});
    triggerIngest();
  }, [
    connectorDialogFields,
    setConnectorDialogFields,
    handleConnectorDialogOpen,
  ]);

  const addAnalysis = useCallback(async () => {
    if (analysisDialogFields.id || analysisDialogFields.id === 0) {
      await patchAnalysis({
        ...analysisDialogFields,
        type: analysisDialogOpen,
      });
    } else {
      await postAnalysis({
        ...analysisDialogFields,
        type: analysisDialogOpen,
      });
    }
    const analysis = await getAnalysis();
    setAnalysis(analysis);
    handleAnalysisDialogOpen(null);
    setAnalysisDialogFields({});
    triggerIngest();
  }, [
    analysisDialogFields,
    setAnalysisDialogFields,
    analysisDialogOpen,
    handleAnalysisDialogOpen,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const connectors = await getConnectors();
      setConnectors(connectors);
      const analysis = await getAnalysis();
      setAnalysis(analysis);
    };
    fetchData();
  }, [setConnectors, setAnalysis]);

  console.log({
    connectors,
    analysis,
  });
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
          <SelectAdd
            options={connectorOptions}
            onAddClick={handleConnectorDialogOpen}
          />
          <ConfigurationList
            options={connectorOptions}
            items={connectors}
            className="mt-4"
            onOpen={handleConnectorDialogOpen}
          />
        </Col>
        <Col numColSpan={1}>
          <Flex alignItems="center" justifyContent="center" className="mb-4">
            <Icon icon={SparklesIcon} />
            <Title>Analysis</Title>
          </Flex>
          <SelectAdd
            options={analysisOptions}
            onAddClick={handleAnalysisDialogOpen}
          />
          <ConfigurationList
            options={analysisOptions}
            items={analysis}
            className="mt-4"
            onOpen={handleAnalysisDialogOpen}
          />
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
      <Flex className="mt-10">
        <ConfigsTable />
      </Flex>
      <ConnectorDialog
        isDialogOpen={isConnectorDialogOpen}
        type={connectorDialogOpen}
        handleOpen={handleConnectorDialogOpen}
        add={addConnector}
        dialogFields={connectorDialogFields}
        setDialogField={setConnectorDialogField}
      />
      <AnalysisDialog
        isDialogOpen={isAnalysisDialogOpen}
        type={analysisDialogOpen}
        handleOpen={handleAnalysisDialogOpen}
        add={addAnalysis}
        dialogFields={analysisDialogFields}
        setDialogField={setAnalysisDialogField}
      />
    </div>
  );
};

export default Setup;

"use client";

import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  TextInput,
  Button,
  Grid,
  Col,
  Card,
  List,
  ListItem,
  Text,
  Flex,
  Title,
} from "@tremor/react";

export const LabeledTextInput = ({ label, ...props }) => (
  <Flex alignItems="between">
    <Flex alignItems="center">
      <Text>{label}</Text>
    </Flex>
    <TextInput {...props} className="max-w-sm auto" />
  </Flex>
);

export default () => (
  <div>
    <a href="/setup">
      <Button variant="light" icon={ArrowLeftIcon}>
        Zurück zum Setup
      </Button>
    </a>
    <Card className="max-w-xl auto" decoration="top">
      <Title>CSV Download Connector Configuration</Title>
      <List className="mt-2">
        <ListItem>
          <LabeledTextInput label="Name" placeholder="Human readable name" />
        </ListItem>
        <ListItem>
          <LabeledTextInput
            label="Download URL"
            placeholder="Download url for a csv with timeseries data"
          />
        </ListItem>
      </List>
    </Card>
  </div>
);

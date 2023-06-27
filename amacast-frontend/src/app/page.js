import { Grid, Col, Card } from "@tremor/react";

export default function Home() {
  return (
    <Grid numItems={1} numItemsSm={3} numItemsLg={3} className="gap-2">
      <Col numColSpan={1}>
        <Card>
          <a href="/setup">Setup</a>
        </Card>
      </Col>
      <Col>
        <Card>
          <a href="/dashboard">Dashboard</a>
        </Card>
      </Col>
    </Grid>
  );
}

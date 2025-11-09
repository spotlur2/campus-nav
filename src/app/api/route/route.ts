import { NextRequest, NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';

export async function POST(req: NextRequest) {
  const { start, endPOI } = await req.json();

  const session = driver.session();

  try {
    // Example query for shortest path
    const result = await session.run(
      `MATCH (start:Waypoint {id: $startId}), (end:POI {name: $endName}),
             path = shortestPath((start)-[:CONNECTED_TO*]->(end))
       RETURN [n IN nodes(path) | {lat: n.lat, long: n.long}] AS coords`,
      { startId: start.id, endName: endPOI }
    );

    const coords = result.records[0]?.get('coords') || [];
    return NextResponse.json({ path: coords });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await session.close();
  }
}

import { NextRequest, NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';

export async function POST(req: NextRequest) {
  const { userLocation, endPOI } = await req.json();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      // Get the target POI
      MATCH (end:POI {name: $endName})
      
      // Find the closest open waypoint to user
      MATCH (start:Waypoint)
      WHERE start.open = true
      WITH start, end, point({latitude:$lat, longitude:$lng}) AS userPoint
      ORDER BY point.distance(point({latitude:start.latitude, longitude:start.longitude}), userPoint)
      LIMIT 1
      
      // Find shortest path from start to end
      MATCH p = shortestPath((start)-[:CONNECTED_TO*]->(end))
      RETURN [n IN nodes(p) | {lat: n.latitude, long: n.longitude}] AS coords
      LIMIT 1
      `,
      {
        lat: userLocation[0],
        lng: userLocation[1],
        endName: endPOI
      }
    );

    const coords = result.records[0]?.get('coords') || [];
    return NextResponse.json({ path: coords });
  } catch (err) {
    console.error('Route error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await session.close();
  }
}

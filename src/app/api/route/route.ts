import { NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';
import type { Record as Neo4jRecord, Result as Neo4jResult, Node as Neo4jNode } from 'neo4j-driver';

async function runQuery(cypher: string, params: Record<string, unknown> = {}): Promise<Neo4jResult> {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } finally {
    await session.close();
  }
}

// typing for location points returned by Neo4j
interface Point {
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userLat?: number; userLon?: number; poiId?: string };

    const { userLat, userLon, poiId } = body;
    if (userLat == null || userLon == null || !poiId) {
      return NextResponse.json({ error: 'missing parameters' }, { status: 400 });
    }

    // 1) find nearest open waypoint to user
    const userWpQ = `
      MATCH (w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      RETURN w, point({latitude:$lat, longitude:$lon}) AS userPoint
      ORDER BY point.distance(w.location, userPoint) ASC
      LIMIT 1
    `;
    const userWpRes = await runQuery(userWpQ, { lat: Number(userLat), lon: Number(userLon) });
    if (userWpRes.records.length === 0)
      return NextResponse.json({ error: 'no waypoint near user' }, { status: 404 });

    const userWpNode = userWpRes.records[0].get('w') as Neo4jNode;
    const userWpId = 'toNumber' in userWpNode.identity ? userWpNode.identity.toNumber() : userWpNode.identity;

    // 2) find nearest open waypoint to POI
    const poiWpQ = `
      MATCH (p:POI {id:$poiId})-[:LOCATED_AT]->(w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      RETURN w
      LIMIT 1
    `;
    const poiWpRes = await runQuery(poiWpQ, { poiId });
    if (poiWpRes.records.length === 0)
      return NextResponse.json({ error: 'no waypoint near POI' }, { status: 404 });

    const poiWpNode = poiWpRes.records[0].get('w') as Neo4jNode;
    const poiWpId = 'toNumber' in poiWpNode.identity ? poiWpNode.identity.toNumber() : poiWpNode.identity;

    // 3) compute shortest path using built-in shortestPath
    const spQ = `
      MATCH (start:Waypoint), (end:Waypoint)
      WHERE id(start) = $startId AND id(end) = $endId
      MATCH p = shortestPath((start)-[:CONNECTED_TO*]-(end))
      RETURN [n in nodes(p) | n.location] AS locations
    `;
    const spRes = await runQuery(spQ, { startId: userWpId, endId: poiWpId });

    if (!spRes.records.length) return NextResponse.json({ error: 'no path found' }, { status: 404 });

    const locations = spRes.records[0].get('locations') as Point[];
    const route = locations.map((loc) => ({
      latitude: loc.y ?? loc.latitude ?? 0,
      longitude: loc.x ?? loc.longitude ?? 0
    }));

    return NextResponse.json({ route });
  } catch (err) {
    console.error('route api error', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';

async function runQuery(cypher: string, params: Record<string, unknown> = {}) {
  const session = driver.session();
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

interface Point {
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userLat, userLon, poiId } = body;

    if (userLat == null || userLon == null || !poiId) {
      return NextResponse.json({ error: 'missing parameters' }, { status: 400 });
    }

    //
    // 1. nearest waypoint to user
    //
    const userWpRes = await runQuery(
      `
      MATCH (w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      WITH w, point({latitude:$lat, longitude:$lon}) AS userPoint
      RETURN w
      ORDER BY point.distance(w.location, userPoint) ASC
      LIMIT 1
      `,
      { lat: userLat, lon: userLon }
    );

    if (userWpRes.records.length === 0)
      return NextResponse.json({ error: 'no waypoint near user' }, { status: 404 });

    const userWpNode = userWpRes.records[0].get('w');
    const userWpId = userWpNode.identity.toNumber();

    //
    // 2. nearest waypoint to POI
    //
    const poiWpRes = await runQuery(
      `
      MATCH (p:POI {id:$poiId})-[:LOCATED_AT]->(w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      RETURN w
      LIMIT 1
      `,
      { poiId }
    );

    if (poiWpRes.records.length === 0)
      return NextResponse.json({ error: 'no waypoint near POI' }, { status: 404 });

    const poiWpNode = poiWpRes.records[0].get('w');
    const poiWpId = poiWpNode.identity.toNumber();

    //
    // 3. find route using dijkstra
    //
    const spRes = await runQuery(
      `
      MATCH (start),(end)
      WHERE id(start) = $startId AND id(end) = $endId

      CALL apoc.algo.dijkstra(start, end, 'CONNECTED_TO>', 'distance')
      YIELD path, weight

      RETURN [n in nodes(path) | n.location ] AS locations
      `,
      { startId: userWpId, endId: poiWpId }
    );

    if (spRes.records.length === 0)
      return NextResponse.json({ error: 'no path found' }, { status: 404 });

    const locations = spRes.records[0].get('locations') as Point[];

    const route = locations.map((loc) => ({
      latitude: loc.y ?? loc.latitude ?? 0,
      longitude: loc.x ?? loc.longitude ?? 0
    }));

    return NextResponse.json({ route });
  } catch (err) {
    console.error('route api error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

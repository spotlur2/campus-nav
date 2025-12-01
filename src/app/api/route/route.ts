import { NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';

async function runQuery(cypher: string, params: any = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } finally {
    await session.close();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    if (userWpRes.records.length === 0) return NextResponse.json({ error: 'no waypoint near user' }, { status: 404 });
    const userWpNode = userWpRes.records[0].get('w');

    // 2) find nearest open waypoint to target POI
    const poiWpQ = `
      MATCH (p:POI {id:$poiId})-[:LOCATED_AT]->(w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      RETURN w
      LIMIT 1
    `;
    const poiWpRes = await runQuery(poiWpQ, { poiId });
    if (poiWpRes.records.length === 0) return NextResponse.json({ error: 'no waypoint near POI' }, { status: 404 });
    const poiWpNode = poiWpRes.records[0].get('w');

    // 3) compute shortest path using built-in shortestPath
    const spQ = `
      MATCH (start:Waypoint), (end:Waypoint)
      WHERE id(start) = $startId AND id(end) = $endId
      MATCH p = shortestPath((start)-[:CONNECTED_TO*]-(end))
      RETURN [n in nodes(p) | n.location] AS locations
    `;
    const spRes = await runQuery(spQ, { startId: userWpNode.identity.toNumber ? userWpNode.identity.toNumber() : userWpNode.identity,
                                       endId: poiWpNode.identity.toNumber ? poiWpNode.identity.toNumber() : poiWpNode.identity });

    if (!spRes.records.length) return NextResponse.json({ error: 'no path found' }, { status: 404 });

    const locations = spRes.records[0].get('locations');
    const route = locations.map((loc: any) => ({
      latitude: loc.y ?? loc.latitude,
      longitude: loc.x ?? loc.longitude
    }));

    return NextResponse.json({ route });

  } catch (err: any) {
    console.error('route api error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

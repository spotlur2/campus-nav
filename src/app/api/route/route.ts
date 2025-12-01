import { NextResponse } from 'next/server';
import driver from '../../../../lib/neo4j';

// Helper to run a session
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

    // 1) find nearest open Waypoint to user
    const findUserWpQ = `
      MATCH (w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL
      RETURN w, point({latitude:$lat, longitude:$lon}) AS userPoint
      ORDER BY point.distance(w.location, userPoint) ASC
      LIMIT 1
    `;
    const userWpRes = await runQuery(findUserWpQ, { lat: Number(userLat), lon: Number(userLon) });
    if (userWpRes.records.length === 0) {
      return NextResponse.json({ error: 'no open waypoint near user' }, { status: 404 });
    }
    const userWpNode = userWpRes.records[0].get('w');
    const userWpId = userWpNode.identity.toNumber ? userWpNode.identity.toNumber() : userWpNode.identity;

    // 2) find nearest open Waypoint to target POI (using POI node location)
    const findPoiWpQ = `
      MATCH (p:POI {id:$poiId})
      MATCH (w:Waypoint)
      WHERE w.open = true AND w.location IS NOT NULL AND p.location IS NOT NULL
      RETURN w, point.distance(w.location, p.location) AS dist
      ORDER BY dist ASC
      LIMIT 1
    `;
    const poiWpRes = await runQuery(findPoiWpQ, { poiId });
    if (poiWpRes.records.length === 0) {
      return NextResponse.json({ error: 'no open waypoint near POI or POI missing location' }, { status: 404 });
    }
    const poiWpNode = poiWpRes.records[0].get('w');
    const poiWpId = poiWpNode.identity.toNumber ? poiWpNode.identity.toNumber() : poiWpNode.identity;

    // 3) Ensure a GDS graph projection exists for Waypoints only; if not, create it
    // We'll use a fixed graph name 'wpGraph'
    // First check existence:
    const checkGraph = `CALL gds.graph.exists('wpGraph') YIELD exists RETURN exists`;
    const checkRes = await runQuery(checkGraph);
    const exists = checkRes.records[0].get('exists');

    if (!exists) {
      // create projection using only Waypoint nodes and CONNECTED_TO rels
      const projectQ = `
        CALL gds.graph.project(
          'wpGraph',
          'Waypoint',
          {
            CONNECTED_TO: {
              type: 'CONNECTED_TO',
              orientation: 'UNDIRECTED'
            }
          },
          {
            nodeProperties: ['open'],
            relationshipProperties: ['distance']
          }
        )
      `;
      await runQuery(projectQ);
    }

    // 4) Run Dijkstra on wpGraph
    const dijkstraQ = `
      CALL gds.shortestPath.dijkstra.stream({
        nodeProjection: 'Waypoint',
        relationshipProjection: {
          CONNECTED_TO: {
            type: 'CONNECTED_TO',
            orientation: 'UNDIRECTED'
          }
        },
        startNode: $startId,
        endNode: $endId,
        relationshipWeightProperty: 'distance'
      })
      YIELD nodeIds, totalCost
      RETURN nodeIds, totalCost
    `;
    // Note: In some GDS versions you must refer to an existing in-memory graph by name.
    // If above stream signature fails, you can use graphName:'wpGraph' instead:
    // CALL gds.shortestPath.dijkstra.stream({ graphName: 'wpGraph', sourceNode: $startId, targetNode: $endId, relationshipWeightProperty: 'distance' })

    // Try the variant that references the named graph to be safe:
    const dijkstraQ2 = `
      CALL gds.shortestPath.dijkstra.stream({
        graphName: 'wpGraph',
        sourceNode: $startId,
        targetNode: $endId,
        relationshipWeightProperty: 'distance'
      })
      YIELD nodeIds, totalCost
      RETURN nodeIds, totalCost
    `;

    let dijkstraRes;
    try {
      dijkstraRes = await runQuery(dijkstraQ2, { startId: userWpId, endId: poiWpId });
    } catch (err) {
      // fallback - try dijkstraQ (no named graph)
      dijkstraRes = await runQuery(dijkstraQ, { startId: userWpId, endId: poiWpId });
    }

    if (!dijkstraRes.records || dijkstraRes.records.length === 0) {
      return NextResponse.json({ error: 'no path found' }, { status: 404 });
    }

    const record = dijkstraRes.records[0];
    const nodeIds = record.get('nodeIds');
    const totalCost = record.get('totalCost');

    // 5) Convert nodeIds to coordinates: use UNWIND to fetch nodes by id
    const nodesQuery = `
      UNWIND $ids AS id
      MATCH (n) WHERE id(n) = id
      RETURN n.location AS location
      ORDER BY indexOf($ids, id)
    `;
    // Neo4j driver expects JS numbers in arrays. Using runQuery
    const idsForNeo = nodeIds.map((nid: any) => nid.toNumber ? nid.toNumber() : nid);
    const nodesRes = await runQuery(nodesQuery, { ids: idsForNeo });

    const route = nodesRes.records.map((r) => {
      const loc = r.get('location');
      // loc is a point object {latitude, longitude}
      return { latitude: loc.y ?? loc.latitude, longitude: loc.x ?? loc.longitude };
    });

    return NextResponse.json({ route, totalDistance: totalCost });

  } catch (err: any) {
    console.error('route api error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

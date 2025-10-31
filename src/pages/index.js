import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

const DEFAULT_CENTER = [39.255632, -76.710665]

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>UMBC Navigation</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>
            UMBC Navigation
          </h1>

          <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={17}>
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={DEFAULT_CENTER}>
                  <Popup>
                    Middle of Campus. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </>
            )}
          </Map>

          <p className={styles.description}>
            <code className={styles.code}>npx create-next-app -e https://github.com/colbyfayock/next-leaflet-starter</code>
          </p>

          <p className={styles.view}>
            <Button href="https://github.com/colbyfayock/next-leaflet-starter">Vew on GitHub</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}

import Image from "next/image";
import Head from "next/head";
import "./globals.css";
import Map from "../components/Map";

export default function Home() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <Map />
    </div>
  );
}

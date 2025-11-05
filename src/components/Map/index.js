'use client'
import dynamic from "next/dynamic";

const Map = dynamic (()=> import('./Map'), {ssr: false})
//Map.fitBounds([39.264927, -76.733514],[39.248579, -76.698081])

export default function faqOnly(props){
    return <Map />
}

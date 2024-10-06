"use client";

import dynamic from "next/dynamic";

export default function LandsatComparison() {
  return <Page/>
}

const Page = dynamic(import("@/components/map/map"), {ssr:false})
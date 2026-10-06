import React from "react";
import { PatientDetailClient } from "./PatientDetailClient";

export function generateStaticParams() {
  return [
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
  ];
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return <PatientDetailClient id={params?.id || "p1"} />;
}

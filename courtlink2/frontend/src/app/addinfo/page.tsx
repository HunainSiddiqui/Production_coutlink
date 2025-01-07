"use client";

import React, { Suspense } from "react";
import Addinfo from "./Addinfo"; // Adjust path as necessary

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Addinfo />
    </Suspense>
  );
}
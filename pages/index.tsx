import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useState } from "react";

import prisma from "../lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ fact }: { fact: any }) {
  async function generate() {
    try {
      const response = await fetch("/api/get-fact", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>App!</div>
      {/* <button onClick={() => generate()}>Generate fact</button> */}
      <div>{fact}</div>
    </>
  );
}

export async function getServerSideProps() {
  const fact = await prisma.fact.findFirst({ orderBy: { createdAt: "desc" } });

  return {
    props: {
      fact: fact?.text,
    },
  };
}

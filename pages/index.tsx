import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import prisma from "../lib/prisma";

const inter = Inter({ subsets: ["latin"] });
dayjs.extend(advancedFormat);

export default function Home({ fact }: { fact: any }) {
  return (
    <>
      <Head>
        <title>Daily Historical Fix</title>
        <meta
          name="description"
          content="AI generated false historical facts"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen">
        <div className="max-w-[960px] h-full py-8 md:py-16 px-8 mx-auto flex flex-col justify-between">
          <div className="text-center">
            <h1 className="font-semibold text-xl">Daily Historical Fix</h1>
            <p className="text-sm text-zinc-600">
              Daily OpenAI generated historical events, that could have happened
              on a different timeline?
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
              {fact}
            </h2>
            <p className="text-lg mt-4">
              <a
                href="https://twitter.com/GPTHistoryFix"
                target="_blank"
                rel="noreferrer"
              >
                Get the event on Twitter, every day
              </a>
            </p>
          </div>
          <div className="text-center text-sm text-zinc-600">
            <p>
              Made by{" "}
              <a
                href="https://twitter.com/whitefluffyC"
                target="_blank"
                rel="noreferrer"
              >
                WhiteFluffy
              </a>
              . Source code on{" "}
              <a
                href="https://github.com/Haugen/gpt-fun-fact"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </p>
          </div>
        </div>
      </div>
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

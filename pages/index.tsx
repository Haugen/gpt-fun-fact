import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import prisma from "../lib/prisma";
import Logo from "../components/Logo";

const inter = Inter({ subsets: ["latin"] });
dayjs.extend(advancedFormat);

export default function Home({ fact }: { fact: any }) {
  return (
    <>
      <Head>
        <title>Daily History Fix</title>
        <meta
          name="description"
          content="AI generated false historical facts"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen">
        <div className="max-w-[1100px] h-full py-8 md:py-16 px-8 mx-auto flex flex-col justify-between">
          <div className="text-center">
            <div className="flex items-center mx-auto justify-center mb-4">
              <div className="w-10 h-10 mr-4">
                <Logo />
              </div>
              <h1 className="font-semibold text-xl">Daily History Fix</h1>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Daily{" "}
              <a href="https://openai.com/" target="_blank" rel="noreferrer">
                OpenAI
              </a>{" "}
              generated historical events, that could have happened on a
              different timeline?
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
              {fact}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mt-6">
              <a
                href="https://twitter.com/GPTHistoryFix"
                target="_blank"
                rel="noreferrer"
              >
                Get the event on Twitter, every day
              </a>
            </p>
          </div>
          <div className="text-center text-sm text-zinc-500">
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

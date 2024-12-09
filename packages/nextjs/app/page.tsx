import dynamic from "next/dynamic";
import type { NextPage } from "next";

const AddLiquidityCSR = dynamic(() => import("@/components/AddLiquidity"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <section className="flex flex-col items-center flex-1 p-4">
      <AddLiquidityCSR />
    </section>
  );
};

export default Home;

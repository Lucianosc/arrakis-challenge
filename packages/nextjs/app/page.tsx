import type { NextPage } from "next";
import AddLiquidity from "~~/components/AddLiquidity";

const Home: NextPage = () => {
  return (
    <section className="flex flex-col items-center flex-1 p-4">
      <AddLiquidity />
    </section>
  );
};

export default Home;

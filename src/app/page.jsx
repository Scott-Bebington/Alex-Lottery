import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div className="hidden lg:block">
        <Large />
      </div>
      <div className="hidden md:block lg:hidden">
        <Medium />
      </div>
      <div className="block md:hidden">
        <Small />
      </div>
    </main>
  );

  function Large() {
    return (
      <div className="">
        Large screen
      </div>
    );
  }

  function Medium() {
    return (
      <div className="">
        Medium screen
      </div>
    );
  }

  function Small() {
    return (
      <div className="">
        Small screen
      </div>
    );
  }
}

type AdviceSlip = {
  slip: {
    id: number;
    advice: string;
  };
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Advice() {
  const res = await fetch("https://api.adviceslip.com/advice");

  if (!res.ok) {
    throw new Error(`Failed to fetch advice: ${res.status}`);
  }

  const data: AdviceSlip = await res.json();
  // 阻塞渲染
  await delay(5_000);

  console.log("5s delay finished");

  return (
    <>
      <div>{data.slip.advice}</div>
    </>
  );
}

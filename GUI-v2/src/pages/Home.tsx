import WIP from "../components/temp/wip";
import UpdateCard from "../components/updateCard/updateCard";
import { useState } from "react";

type CardItem = { id: string; title: string; rating: string; coverUrl: string };

const popularSeed: CardItem[] = [
  {
    id: "dark-knight",
    title: "The Dark Knight",
    rating: "9.0",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSFT6lOLo4mxpWG0Z9uq_BEhjgo3OCN92yVrDzRooZFXjMPOxdidbx7nG5xtfcFq475xn9z1HHL0gDE7PgiqOcJ5nEdGQmW5CnMJaSQbw6Hx7OgrP9fjK2_35Z4mS8cdBAln975tkl4wIfe2wpg8QzVbiyfHJ-KN2OVTmCLMN-hVQ-XOq-S3fLqwokLoHiDnO-TrsOBW6UhgccS6fdTgACFk6BWZeX-T8M-8JSbfYbYQheoCyrCJqNw37ixWmM1fQBwEOCZlzTzyft",
  },
  {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    rating: "8.9",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSK1Hpc4giqKdl4eOhQwAjp9KdZYsU56qnb-JoUzjM3QbID-bIW4ZHK6e6a8ZA9VmxE1l8uJRtJdneBew30twZSIgF4dqgJnql7c3in3dQE6QJEk3tJVkyzOtG4ttC85SbfLhXos8tYJdxf3ajxmYe3rcq-TLqbEKA9i2F1G4Ye9-EBRRhwO1lJPvrmzH3_OhD4vDELNvy56IDscQApxHs6BkO-A0tJP6aG9bf97hxmv9rPGK8ioviJNP4kD1i5JZOOFuKw5LB-d_C",
  },
  {
    id: "forrest-gump",
    title: "Forrest Gump",
    rating: "8.8",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWuxRqOLRNs8OyNdlW6i9RwfoSA3vX1n-HhxWECoGzjk8BOuOgr_Il64GPkqe33idWrVUfBtL36XBmsBug1JcbN2ZIKQvNmkaH93u-xFyVF2ZcOx92lJNSpwwVgtW4cWynVM6oJoG2OaTCza7zb5n4pf86ZFjm0rG80PUxnWjK48QnDnOkJKv14cUv0uW-xn2dfKgC4kKs08MzbFvoIxsyijy23beAQl801IM9jQPaRdY1vouX5D954YAdkTUbCxIZAUep_COWt4-A",
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    rating: "8.7",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnu0MUJ4LNbf3Fp1Qme75t0-ZrwvS3OA8NJcqp1FcqqCpUqzKCQ1aftW4kWbfvir1IumM6GU-wSNuOsNYnpKY7TcMP5KJFls2eSJbcLBZNym5M5Wz5MZWzEWy2iip4mtPmLJ-EIWyFwlci9fKFp2sv8vJAC7k0VDQWIHntlT4jdAyibSCAcZhOz_AnNrWdUJutODuSft2OKNCkKvnpBjkjkCloiDFswdTOJXSlVZXj0mOPL-ZbbAXSMNNA788Zr2CIoUCnZ9k6LJLF",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    rating: "8.6",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4p6kc3LlzZgNASs9X7JSAfZH4Mtcrt7Q5p-5hd7W-42DVBYKG82ibi-QO29fKjnAdpthSLVEl5joR2O982Pa9bBwkFQ9DsFWW_9YOw9lpwnZtQPH-blIHD2E1H8LQhs0oPFcqTIHJ8UFsclJ3ye3G5IkG2c6CxxExjHWrTZJ17bnW7c-gjU9Q4IZlkDXi9ZtH-aIumyAmvoTcx89uX4KKGTgazZOOrEZ_nGPufayk5LbA1YG5Qb6dgfAONJoKFa4iXItxYfV3Zrbd",
  },
  {
    id: "parasite",
    title: "Parasite",
    rating: "8.6",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3bbpKyOhy-SgDtYhhkrywv5W8AMQ5yfRntkZLsbw4JHp3CMaVXCXN66g7LNfg7MMHVC1uu_VSZG7biV4SY1KfuFYV--eOtb-uEP9CbfyaoTBuE6-s5WppFQdu58KpCSWkuAzcFYJgFwNWSs4UIlMP2BXJtsAMk3rBtrcrLgFAbcwqC2j1QGpljGs1PBlJKztPz4GjlkMwJZA8OJX6u87eeiOFj1dQbVhjH6lCtMboxH-si3UlHljgGcc-y2bE5jcOv_rfxl8r1N9e",
  },
];

const latestSeed: CardItem[] = [
  {
    id: "dune-2",
    title: "Dune: Parte Due",
    rating: "8.3",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3zZoY8_ipA9tMnfSLosqfsgjSZLG2cNOxYlgC2-PscRSNF6dooOw1ItQh-kc07bgrKwF6RqA6ix-PSSlV3jGsrgTZk3Tq3b1M3y1pg206OQnLu7qRtOlu9PU4FWpezij31xZXbC35d_eFsnYzo-QaRxpLUHVStUR2KFR5jJVtwMvqaoM5jjepcz3M6JTLcAg2zVczH513wk8idlpg0NyFoojGwaLDjlJlmMBgnadN3zaCOiT2PTOP_DacF6V4fOgVD62sC973P25D",
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    rating: "8.1",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGkHKasHfrc5yFZEU1myjYypJJ63xyP_dbiBOq3OaOAovgwhRZ9RItoFBjUaiyYdn26EfiIJw8NyDkWJWOw9dkwhRfAtah-rpz90jHAH4Z2tgDSKeuksccMWzltiCjAHVVb5jMYf8EzytX3xGeU7ks77sLa9-mwHqRiSoMQz1fWQ55QKciBxUuHY-1Qj-PdaQyOIG17tuFFlAp8LCowT_7WkLZASQwA4squhQ46ABX860oFJim5cudx5lVbAv_CenXRnXSHOmEkTNC",
  },
  {
    id: "spiderverse",
    title: "Spider-Man: Across the Spider-Verse",
    rating: "8.4",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRKMFbCF7CWBr8rWVSFKB9FlOYQ9cuo-3uSvvQ8R19nTJo_6chKP--gP1ahYmNLV2oO4lrvwAaVueqz5CTWfEimwwyFSL7wWBopUnlQ7ssc15KRwX8sHU8lmfdcgnLvsTSAzwfV_DVhYwEf53pwPiqcaM-nc4u24-neM1PlvQztbT_y7ze7uXBrBqMIyT47JPoVdY4MhN1rlXUmXXUOQx5BHtRfaIXUag3WTlQA7j_0pJvs9ajPmYb-Z_0CjZCQO68TNFOoZFJcI2W",
  },
  {
    id: "povere-creature",
    title: "Povere Creature!",
    rating: "8.2",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX_NiJnNoYltNcn8DiFoepGnD95P5m4jiHqBxBbodlOt4MJtR_pLaOFajJRy6mItN46hwRRopOMFkarHaSYN1Bsr7p6c0rYHEyZbNa_EnF2WLw8o98jSJNuL3JR8wOsRa4-aPDH_Y_zTwoeDgala3cyu3GybrmcTnpXDXwhLSdM1EqGoK80a_Odz5EMYA5U0cgRhNQcjPoE22Ao0y0d_R6Sy9StzS_gswY8H_Jgb3sr3BuTwxbSZahsjpCTZoDkpXIoc-6Rs0wJ7xT",
  },
  {
    id: "holdovers",
    title: "The Holdovers",
    rating: "7.9",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1kRzMUo9vEe12-L2js-33lMp9FXzCBjgi7fq9v7A8gZuwn5q6UlI7YlATSNAKuJVYWp8ZAnaq6uwuXo9jURKgufk7CpqdYUrHAZVl0O6Q32ojyZPHHZ5P8m8kLhOA8R5cl1Hj6i7RCCrNThoSib9r2LoxdHNlTkSXR2yV4U3J_bhlbIVWaQICIbokOaywJohIjwHLYWc9SvOc8v5GMwOs3j-XBE-105hRO0fNu5QDlqmRqfybtuIZTobmka7y0uP6NeAbcAzCELXz",
  },
  {
    id: "godzilla-minus-one",
    title: "Godzilla Minus One",
    rating: "8.0",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF10GXD0tw75rC-z4eDnxCidQgkS2slSr3FbuKJ0y--f_TMvd2PBAiyBEshz0ZOnEqp2PNuDYpNMJUQsKPMNxA9PH56iijHH3RKCHSdWWnxEaso5M18w9Ykk6W5D2ODxcDRe-w_CaiGPiLzfjVhtpzOo2R5XOfP1loXhp0Vlf5M4TUXykPTCY-9VTmAlJy2UQmwrVSAaRMxi8tpfw_fzoSloPoSrL9niVaKP2-bKML0BAMqRExsRfwgi2QrpHloYtFwf5YzUrn-Wdy",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
      <WIP />

      <UpdateCard version="2.1.0" updateAvailable={true} />

      {/* Hero */}
      <div className="@container px-4 mt-6">
        <div
          className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10 relative overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(17,17,24,1) 10%, rgba(17,17,24,0) 60%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrWychlsrOw_KSsUicU4MkYvN_momW9CUHbM3WMOaIkcIsbmgGwO2lVm9T9IJRnN-LiwfuTw2iGwvHmmPVbdcIJwqEIrnSpDW51xKEyEWHI7n_sikcBmeoI47GAVGLAB2tDOmQySTVZPh2lX9JGKXv216uc6H2HVnJ5ji5_Erx80u9GTt271X6uqpg0biPz1SB5nMx-wanE9lAMmKVQQdg00yvlKdbhYQL3OUlsyTXXnvVoKvklPNGmTPBcIP2m9WLglBjy1VYa2fv')",
          }}
        >
          <div className="flex flex-col gap-4 text-left max-w-2xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl">
              Blade Runner 2049
            </h1>
            <h2 className="text-gray-300 text-base @[480px]:text-lg">
              L'agente K della Polizia di Los Angeles scopre un segreto sepolto
              da tempo che potrebbe far precipitare nel caos quello che è
              rimasto della società. La sua scoperta lo spinge a cercare Rick
              Deckard, un ex blade runner scomparso da 30 anni.
            </h2>
          </div>
          <div className="flex-wrap gap-4 flex">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold tracking-[0.015em] hover:bg-blue-700 transition-colors">
              <span className="truncate">Scarica Ora</span>
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-gray-800 text-white text-base font-bold tracking-[0.015em] hover:bg-gray-700 transition-colors">
              <span className="truncate">Guarda il Trailer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-14 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-gray-400 flex bg-gray-800 items-center justify-center pl-4 rounded-l-xl">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-blue-600 focus:ring-inset bg-gray-800 h-full placeholder:text-gray-400 px-4 rounded-l-none"
              placeholder="Cerca film o serie TV..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Popular */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Più Popolari
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-4">
          {popularSeed.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 pb-3 group">
              <div
                className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url('${item.coverUrl}')` }}
              />
              <div>
                <p className="text-white text-base font-medium leading-normal">
                  {item.title}
                </p>
                <p className="text-gray-400 text-sm font-normal leading-normal">
                  {item.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Ultime Uscite
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-4">
          {latestSeed.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 pb-3 group">
              <div
                className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url('${item.coverUrl}')` }}
              />
              <div>
                <p className="text-white text-base font-medium leading-normal">
                  {item.title}
                </p>
                <p className="text-gray-400 text-sm font-normal leading-normal">
                  {item.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

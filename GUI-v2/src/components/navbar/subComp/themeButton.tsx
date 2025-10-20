const themeSwitch = () => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultValue={1} className="sr-only peer" />
      <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-20 h-10 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-8 after:w-8 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-10 peer-hover:after:scale-95">
        <svg
          className="absolute top-1 left-11 stroke-gray-900 w-8 h-8"
          height={100}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100"
          width={100}
          x={0}
          xmlns="http://www.w3.org/2000/svg"
          y={0}
        >
          <path
            className="svg-fill-primary"
            d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z"
          ></path>
        </svg>

        <svg
          className="absolute top-1.5 left-1.5 stroke-gray-900 w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          height={100}
          width={100}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 -960 960 960"
          fill="#e3e3e3"
          x={0}
          y={0}
        >
          <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z" />
        </svg>
      </div>
    </label>
  );
};

export default themeSwitch;

import { Battleship } from "./battleship";
import seaSurface from "./data/sea_surface2.png";

export function BattleshipPage() {
  const USER_NAME = "PLAYER";
  const OPPONENT_NAME = "OPPONENT";
  return (
    <>
      <div className="fixed top-0 h-screen bg-[#000a3c] w-[15%]">
        <button
          className="bg-[#001478] px-9 py-4 m-5 rounded-3xl
          text-white text-lg"
        >
          Main menu
        </button>
      </div>

      <div
        className="bg-cover bg-center min-h-screen flex items-center flex-col"
        style={{ backgroundImage: `url(${seaSurface})` }}
      >
        <div className="w-[40%]">
          <div className="">
            <div className="flex justify-between  mt-10 mb-20">
              <p>{USER_NAME}</p>
              <p className="w-40 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                TIMER
              </p>
              <p>{OPPONENT_NAME}</p>
            </div>
          </div>

          <div className="p-10">
            <div className="flex flex-row gap-5">
              <Battleship />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

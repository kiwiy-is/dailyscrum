import Card from "./card";

import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card />
    </div>
  );
}

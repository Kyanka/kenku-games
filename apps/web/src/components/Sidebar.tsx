import logo from "../images/logo.svg";
import { useState } from "react";

interface ExpandableBoxProps {
  title: string;
  children: React.ReactNode;
}
function ExpandableBox({ title, children }: ExpandableBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▼" : "►"}

        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside>
      <div className="">
        <img src={logo} alt="logo" />
      </div>

      <ExpandableBox title="">
        <p></p>
      </ExpandableBox>
    </aside>
  );
}

import { useState } from "react";

export default function TestModal() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "2rem", background: "#222", color: "#fff" }}>
      <h3>Test Modal</h3>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}

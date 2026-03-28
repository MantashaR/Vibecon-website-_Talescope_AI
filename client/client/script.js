async function generate() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  output.innerText = "Generating...";

  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: input })
  });

  const data = await res.json();
  output.innerText = data.text;
}
